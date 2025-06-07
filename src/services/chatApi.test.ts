// Test structure for chatApi.ts
import { sendChatMessage, UnexpectedResponseFormatError } from './chatApi';
import { ChatApiResponse } from '@/types';

// Mock global fetch
global.fetch = jest.fn();

// Mock console.error and console.log to spy on them
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});


describe('chatApi', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  afterAll(() => {
    // Restore console mocks
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('sendChatMessage', () => {
    const mockRequest = {
      messages: [{ role: 'user' as const, content: 'Hello' }],
      userProfile: { username: 'test', travelStyle: 'adventure', interests: [], preferredLanguage: 'en' },
      messageId: '123'
    };

    it('should return ChatApiResponse for valid JSON response', async () => {
      const mockApiResponse: ChatApiResponse = { text: 'Hello back', richContent: { type: 'info', data: {} } };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse, // Mock for response.json() if used
        text: async () => JSON.stringify(mockApiResponse), // Mock for response.text()
      });

      const result = await sendChatMessage(mockRequest);
      expect(result).toEqual(mockApiResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should return ChatApiResponse with text for plain text response', async () => {
      const plainTextResponse = 'This is a plain text response.';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => plainTextResponse,
      });

      const result = await sendChatMessage(mockRequest);
      expect(result).toEqual({ text: plainTextResponse });
    });

    it('should return ChatApiResponse for JSON response that is a string', async () => {
      const jsonStringResponse = "Just a string in JSON";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(jsonStringResponse),
      });

      const result = await sendChatMessage(mockRequest);
      expect(result).toEqual({ text: jsonStringResponse });
    });

    it('should handle 401 Unauthorized error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized', // Added for completeness
      });

      const result = await sendChatMessage(mockRequest);
      expect(result.text).toContain("authentication issue");
      expect(consoleErrorSpy).toHaveBeenCalledWith('Authentication failed - 401 Unauthorized');
    });

    it('should throw an error for other non-ok HTTP responses (e.g. 500)', async () => {
      const errorText = 'Internal Server Error';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => errorText,
      });

      const result = await sendChatMessage(mockRequest);
      expect(result.text).toContain("couldn't connect to the chat service");
      expect(consoleErrorSpy).toHaveBeenCalledWith(`HTTP error! status: 500, body: ${errorText}`);
    });

    it('should handle empty response body with UnexpectedResponseFormatError message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '',
      });

      const result = await sendChatMessage(mockRequest);
      expect(result.text).toContain("Received an empty response from the chat API.");
      expect(consoleErrorSpy).toHaveBeenCalledWith('Empty response body from API');
    });

    it('should handle unexpected JSON structure with UnexpectedResponseFormatError message', async () => {
      const unexpectedJsonResponse = { data: 'some data', but: 'no text field' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(unexpectedJsonResponse),
      });

      const result = await sendChatMessage(mockRequest);
      expect(result.text).toContain("The chat API returned an unexpected JSON structure.");
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected JSON structure:', unexpectedJsonResponse);
    });

    it('should handle fetch throwing a network error', async () => {
      const networkErrorMessage = 'Network failed';
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(networkErrorMessage));

      const result = await sendChatMessage(mockRequest);
      expect(result.text).toContain("check your internet connection");
      expect(consoleErrorSpy).toHaveBeenCalledWith('Chat API processing error:', expect.any(Error));
    });

    it('should handle UnexpectedResponseFormatError specifically in the catch block', async () => {
      // This test forces an UnexpectedResponseFormatError to be thrown from within the try block
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ wrong: "structure" }), // Will cause UnexpectedResponseFormatError
      });

      const result = await sendChatMessage(mockRequest);
      expect(result.text).toMatch(/unexpected format. Details: The chat API returned an unexpected JSON structure/);
      // Check if the specific error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Chat API processing error:', expect.any(UnexpectedResponseFormatError));
    });

    it('should handle generic Error (HTTP error) specifically in the catch block', async () => {
      // This test forces an Error "HTTP error! status: 503" to be thrown
       (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 503, // Service Unavailable
        text: async () => "Service Unavailable",
      });

      const result = await sendChatMessage(mockRequest);
      expect(result.text).toContain("couldn't connect to the chat service. There seems to be a server-side issue.");
       expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP error! status: 503, body: Service Unavailable');
      // Also check the generic catch-all log
      expect(consoleErrorSpy).toHaveBeenCalledWith('Chat API processing error:', expect.objectContaining({ message: 'HTTP error! status: 503' }));
    });
  });
});
