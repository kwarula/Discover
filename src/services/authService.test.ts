import { authService, supabase } from './authService';
import { UserProfile } from '@/types';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => {
  const mockAuth = {
    getUser: jest.fn(),
    // Add other auth methods if needed for other tests
  };
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };
  const mockSupabaseClient = {
    auth: mockAuth,
    from: jest.fn(() => mockQueryBuilder),
  };
  return {
    createClient: jest.fn(() => mockSupabaseClient),
    // Export any other specific types/values if your code imports them directly
  };
});

// Typed mock for easier usage
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('authService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return user profile if user and profile exist', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      const mockProfile: UserProfile = {
        username: 'testuser',
        travelStyle: 'adventure',
        interests: ['hiking'],
        preferredLanguage: 'en'
      };

      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: mockUser }, error: null });
      // Ensure 'from' is correctly mocked to return the chainable query builder methods
      const fromMock = supabase.from as jest.Mock;
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest.fn().mockReturnThis();
      const singleMock = jest.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
      fromMock.mockReturnValue({ select: selectMock, eq: eqMock, single: singleMock });


      const result = await authService.getCurrentUser();

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email!,
        ...mockProfile,
      });
      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
      expect(supabase.from).toHaveBeenCalledWith('user_profiles');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('id', mockUser.id);
      expect(singleMock).toHaveBeenCalledTimes(1);
    });

    it('should return null if no user is found', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: null });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should return null if user exists but profile does not', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: mockUser }, error: null });

      const fromMock = supabase.from as jest.Mock;
      const singleMock = jest.fn().mockResolvedValueOnce({ data: null, error: null });
      fromMock.mockReturnValue({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: singleMock });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('user_profiles');
      expect(singleMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if supabase.auth.getUser fails', async () => {
      const errorMessage = 'Supabase auth error';
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error(errorMessage) });

      await expect(authService.getCurrentUser()).rejects.toThrow(errorMessage);
      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should throw an error if fetching profile fails', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      const errorMessage = 'Supabase profile fetch error';
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: mockUser }, error: null });

      const fromMock = supabase.from as jest.Mock;
      const singleMock = jest.fn().mockResolvedValueOnce({ data: null, error: new Error(errorMessage) });
      fromMock.mockReturnValue({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: singleMock });

      await expect(authService.getCurrentUser()).rejects.toThrow(errorMessage);
      expect(supabase.from).toHaveBeenCalledWith('user_profiles');
      expect(singleMock).toHaveBeenCalledTimes(1);
    });
  });
});
