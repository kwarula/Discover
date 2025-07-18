import { UserProfile } from '@/types';
import { supabase } from '@/lib/supabase'; // Import the shared Supabase client

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
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://www.discoverdiani.co.ke/chat'
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      // OAuth redirect will handle the rest
      return {
        success: true,
        message: 'Redirecting to Google...'
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        message: 'Failed to initiate Google sign-in. Please try again.'
      };
    }
  },

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

      if (!profile) {
        // If no profile exists but user is authenticated (e.g., Google sign-in),
        // create a basic profile from auth metadata
        if (user.user_metadata?.full_name || user.user_metadata?.name) {
          const username = user.user_metadata.full_name || user.user_metadata.name;
          
          // Create profile in database
          const { data: newProfile, error } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: user.id,
                username: username,
                travel_style: 'relaxed',
                interests: [],
                preferred_language: 'English'
              }
            ])
            .select()
            .single();

          if (!error && newProfile) {
            return {
              id: user.id,
              email: user.email!,
              username: newProfile.username,
              travelStyle: newProfile.travel_style,
              interests: newProfile.interests,
              preferredLanguage: newProfile.preferred_language
            };
          }
        }
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        username: profile.username,
        travelStyle: profile.travel_style,
        interests: profile.interests,
        preferredLanguage: profile.preferred_language
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
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
      console.log('Auth state change:', event, session?.user?.id);
      callback(session?.user || null);
    });
  }
};
