import { ChatApiRequest, ChatApiResponse } from '@/types';

// Custom error for unexpected response formats
export class UnexpectedResponseFormatError extends Error {
  constructor(message: string, public responseData?: any) {
    super(message);
    this.name = 'UnexpectedResponseFormatError';
  }
}

const API_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-proxy`;

export const sendChatMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  try {
    console.log('Sending chat request:', request);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(request),
    });

    console.log('API Response status:', response.status);
    // console.log('API Response headers:', response.headers); // Can be verbose

    if (response.status === 401) {
      console.error('Authentication failed - 401 Unauthorized');
      // Return a specific message for auth failure, not throwing an error here
      // as the UI might want to handle this as a content message rather than a system error.
      return {
        text: "I'm having trouble connecting to my knowledge base right now due to an authentication issue. Please ensure the API keys are correctly configured. In the meantime, Diani Beach is famous for its stunning white sands and vibrant coral reefs!"
      };
    }

    if (!response.ok) {
      // For other non-ok responses, log the status and throw a generic HTTP error
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    // console.log('Raw response text:', responseText); // Can be verbose

    if (!responseText) {
      // If the response body is empty, it's an unexpected scenario.
      console.error('Empty response body from API');
      throw new UnexpectedResponseFormatError('Received an empty response from the chat API.');
    }

    try {
      const parsedData = JSON.parse(responseText);
      console.log('Parsed JSON data:', parsedData);

      // Check if the parsed data conforms to ChatApiResponse (has a 'text' property of type string)
      if (parsedData && typeof parsedData.text === 'string') {
        // It matches the expected ChatApiResponse structure (or a superset of it)
        return parsedData as ChatApiResponse;
      } else if (typeof parsedData === 'string') {
        // If the JSON itself is a string (e.g., API directly returns "some message")
        return { text: parsedData };
      } else {
        // The JSON structure is not what we expect (e.g., missing 'text' or 'text' is not a string)
        console.error('Unexpected JSON structure:', parsedData);
        throw new UnexpectedResponseFormatError('The chat API returned an unexpected JSON structure.', parsedData);
      }
    } catch (parseError) {
      // If JSON.parse fails, it means the responseText is not valid JSON.
      // In this case, we treat the entire responseText as the chat message.
      console.log('Response is not JSON, treating as plain text:', responseText);
      return { text: responseText };
    }

  } catch (error) {
    console.error('Chat API processing error:', error);

    if (error instanceof UnexpectedResponseFormatError) {
      // Rethrow custom error to be potentially handled differently by the UI
      // Or transform it into a user-friendly ChatApiResponse
      return {
        text: `I received a response, but the format was unexpected. Details: ${error.message}`
      };
    }
    
    if (error instanceof Error && error.message.startsWith('HTTP error!')) {
       return {
        text: "Sorry, I couldn't connect to the chat service. There seems to be a server-side issue. Please try again later."
      };
    }

    // Generic fallback for other errors (e.g., network issues)
    return {
      text: "I apologize, but I'm having trouble connecting right now. Please check your internet connection and try again. Diani Beach is a wonderful destination with lots to offer!"
    };
  }
};