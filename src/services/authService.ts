import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '@/types';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SignupData {
  email: string;
  password: string;
  username: string;
  travelStyle: UserProfile['travelStyle'];
  interests: string[];
  preferredLanguage: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile & { email: string; id: string };
  needsVerification?: boolean;
}

export interface VerificationData {
  email: string;
  code: string;
}

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Supabase-based authentication service
export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // Validate email
      if (!validateEmail(data.email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }
      
      // Validate password
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: passwordValidation.errors[0]
        };
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            travel_style: data.travelStyle,
            interests: data.interests,
            preferred_language: data.preferredLanguage
          }
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Please check your email to verify your account.',
        needsVerification: true
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      // Fetch user profile
      const userProfile = await this.getCurrentUser();
      
      return {
        success: true,
        message: 'Email verified successfully! Welcome to Discover Diani!',
        user: userProfile
      };
    } catch (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        message: 'Verification failed. Please try again.'
      };
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      const userProfile = await this.getCurrentUser();
      
      return {
        success: true,
        message: 'Welcome back!',
        user: userProfile
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  },

  async getCurrentUser(): Promise<(UserProfile & { email: string; id: string }) | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email!,
        username: profile.username,
        travelStyle: profile.travel_style,
        interests: profile.interests,
        preferredLanguage: profile.preferred_language
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Rethrow the error or throw a custom error to be handled by the caller
      // For now, let's rethrow the original error for the caller to handle.
      // In a more mature system, we might define custom error classes.
      throw error;
    }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async resendVerificationCode(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Verification email sent. Please check your inbox.'
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        message: 'Failed to resend verification email.'
      };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
};
