import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { UserProfile } from '@/types';
import { toast } from '@/hooks/use-toast';
import { authService, SignupData, LoginData, validateEmail } from '@/services/authService';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { EmailVerificationModal } from './EmailVerificationModal';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Chrome, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

// Types
type SignupStep = 'auth' | 'profile' | 'verification';
type AuthMode = 'login' | 'signup';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  general?: string;
}

interface LoadingStates {
  login: boolean;
  signup: boolean;
  googleAuth: boolean;
  fieldValidation: boolean;
}

// Constants
const ANIMATION_DURATION = 300;
const DEBOUNCE_DELAY = 500;
const MAX_RETRY_ATTEMPTS = 3;
const PASSWORD_MIN_LENGTH = 8;

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'At least 8 characters', id: 'length' },
  { regex: /[A-Z]/, text: 'One uppercase letter', id: 'uppercase' },
  { regex: /[a-z]/, text: 'One lowercase letter', id: 'lowercase' },
  { regex: /\d/, text: 'One number', id: 'number' },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'One special character', id: 'special' }
];

const AVAILABLE_INTERESTS = [
  'Diving', 'Snorkeling', 'Local Cuisine', 'Wildlife', 'Photography', 
  'Beach Activities', 'Cultural Experiences', 'Nightlife', 'Wellness', 'Adventure Sports'
];

const TRAVEL_STYLES = [
  { value: 'adventure', label: 'Adventure Seeker', emoji: '🏔️' },
  { value: 'relaxed', label: 'Relaxed Explorer', emoji: '🌺' },
  { value: 'family', label: 'Family Traveler', emoji: '👨‍👩‍👧‍👦' },
  { value: 'luxury', label: 'Luxury Enthusiast', emoji: '✨' },
  { value: 'budget', label: 'Budget Conscious', emoji: '💰' }
];

export const AuthModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    setUserProfile,
    isEmailVerificationModalOpen,
    setIsEmailVerificationModalOpen,
    pendingVerificationEmail,
    setPendingVerificationEmail
  } = useAppContext();

  // State management
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [currentStep, setCurrentStep] = useState<SignupStep>('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    login: false,
    signup: false,
    googleAuth: false,
    fieldValidation: false
  });
  const [retryCount, setRetryCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form data
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [profileData, setProfileData] = useState({
    username: '',
    travelStyle: 'adventure' as UserProfile['travelStyle'],
    interests: [] as string[],
    preferredLanguage: 'English',
  });

  // Refs
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Utility functions
  const debounce = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => func(...args), delay);
    };
  }, []);

  const validatePassword = (password: string) => {
    const results = PASSWORD_REQUIREMENTS.map(req => ({
      ...req,
      valid: req.regex.test(password)
    }));
    return results;
  };

  const validateField = useCallback((field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
        const validationResults = validatePassword(value);
        const failedRequirements = validationResults.filter(r => !r.valid);
        if (failedRequirements.length > 0) {
          return `Password must contain: ${failedRequirements.map(r => r.text.toLowerCase()).join(', ')}`;
        }
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== authData.password) return 'Passwords do not match';
        return '';
      
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      
      default:
        return '';
    }
  }, [authData.password]);

  const debouncedValidation = useCallback(
    debounce((field: string, value: string) => {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }, DEBOUNCE_DELAY),
    [validateField]
  );

  // Event handlers
  const handleInputChange = useCallback((field: string, value: string) => {
    if (field === 'email' || field === 'password' || field === 'confirmPassword') {
      setAuthData(prev => ({ ...prev, [field]: value }));
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear errors on input change
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Debounced validation
    debouncedValidation(field, value);
  }, [errors, debouncedValidation]);

  const setLoading = useCallback((type: keyof LoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [type]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setAuthData({ email: '', password: '', confirmPassword: '' });
    setProfileData({
      username: '',
      travelStyle: 'adventure',
      interests: [],
      preferredLanguage: 'English',
    });
    setErrors({});
    setCurrentStep('auth');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRetryCount(0);
    
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsLoginModalOpen(false);
    setTimeout(resetForm, ANIMATION_DURATION);
  }, [setIsLoginModalOpen, resetForm]);

  const handleStepTransition = useCallback((newStep: SignupStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsTransitioning(false);
      
      // Focus management
      if (newStep === 'profile' && usernameRef.current) {
        usernameRef.current.focus();
      }
    }, ANIMATION_DURATION / 2);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateField('email', authData.email);
    const passwordError = validateField('password', authData.password);
    const confirmPasswordError = authMode === 'signup' ? validateField('confirmPassword', authData.confirmPassword) : '';
    
    if (emailError || passwordError || confirmPasswordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }

    if (authMode === 'signup') {
      handleStepTransition('profile');
      return;
    }

    // Login flow
    setLoading('login', true);
    setErrors({});
    
    // Create abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await authService.login({
        email: authData.email,
        password: authData.password
      }, { signal: abortControllerRef.current.signal });

      if (response.success && response.user) {
        setUserProfile({
          username: response.user.username,
          travelStyle: response.user.travelStyle,
          interests: response.user.interests,
          preferredLanguage: response.user.preferredLanguage
        });
        
        toast({
          title: "Welcome back!",
          description: `Nice to see you again, ${response.user.username}!`,
          duration: 5000,
        });
        
        handleClose();
        setRetryCount(0);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      
      console.error('Login error:', error);
      
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      setErrors({ general: errorMessage });
      
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        setRetryCount(prev => prev + 1);
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading('login', false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const usernameError = validateField('username', profileData.username);
    if (usernameError) {
      setErrors({ username: usernameError });
      return;
    }

    setLoading('signup', true);
    setErrors({});
    
    abortControllerRef.current = new AbortController();

    try {
      const signupData: SignupData = {
        email: authData.email,
        password: authData.password,
        username: profileData.username.trim(),
        travelStyle: profileData.travelStyle,
        interests: profileData.interests,
        preferredLanguage: profileData.preferredLanguage
      };

      const response = await authService.signup(signupData, { 
        signal: abortControllerRef.current.signal 
      });

      if (response.success) {
        setPendingVerificationEmail(authData.email);
        setIsLoginModalOpen(false);
        setIsEmailVerificationModalOpen(true);
        
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
          duration: 5000,
        });
        
        setRetryCount(0);
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      
      console.error('Signup error:', error);
      
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      setErrors({ general: errorMessage });
      
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        setRetryCount(prev => prev + 1);
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading('signup', false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading('googleAuth', true);
    setErrors({});
    
    try {
      const response = await authService.signInWithGoogle();
      
      if (response.success) {
        toast({
          title: "Redirecting to Google",
          description: "Please complete the sign-in process.",
          duration: 3000,
        });
      } else {
        throw new Error(response.message || 'Google sign-in failed');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      const errorMessage = error.message || 'Something went wrong with Google sign-in. Please try again.';
      setErrors({ general: errorMessage });
      
      toast({
        title: "Sign-in Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading('googleAuth', false);
    }
  };

  const handleInterestToggle = useCallback((interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  }, []);

  const handleVerificationSuccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUserProfile({
          username: currentUser.username,
          travelStyle: currentUser.travelStyle,
          interests: currentUser.interests,
          preferredLanguage: currentUser.preferredLanguage
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleRetry = useCallback(() => {
    setErrors({});
    setRetryCount(0);
  }, []);

  // Effects
  useEffect(() => {
    if (isLoginModalOpen && emailRef.current) {
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [isLoginModalOpen]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isLoginModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoginModalOpen, handleClose]);

  // UI helpers
  const getStepTitle = () => {
    if (authMode === 'login') return 'Welcome Back!';
    if (currentStep === 'auth') return 'Create Your Account';
    if (currentStep === 'profile') return 'Tell Us About Yourself';
    return 'Verify Your Email';
  };

  const getStepDescription = () => {
    if (authMode === 'login') return 'Sign in to continue exploring Diani';
    if (currentStep === 'auth') return 'Join thousands of travelers discovering Diani';
    if (currentStep === 'profile') return 'Help us personalize your experience';
    return 'Check your email for verification code';
  };

  const isFormValid = () => {
    if (currentStep === 'auth') {
      return authData.email && 
             authData.password && 
             (authMode === 'login' || authData.confirmPassword) &&
             !errors.email && 
             !errors.password && 
             !errors.confirmPassword;
    }
    if (currentStep === 'profile') {
      return profileData.username && !errors.username;
    }
    return false;
  };

  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  return (
    <>
      <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] bg-diani-sand-50 border-diani-sand-200 rounded-3xl max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-diani-sand-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 text-diani-sand-600" />
          </button>

          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold font-sohne text-diani-sand-900 text-center">
              {getStepTitle()}
            </DialogTitle>
            <p className="text-sm text-diani-sand-600 text-center mt-2">
              {getStepDescription()}
            </p>
          </DialogHeader>
          
          {/* Progress Indicator for Signup */}
          {authMode === 'signup' && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentStep === 'auth' ? 'bg-diani-teal-500' : 'bg-diani-sand-300'
              }`} />
              <div className={`w-8 h-1 transition-colors duration-300 ${
                currentStep === 'profile' ? 'bg-diani-teal-500' : 'bg-diani-sand-300'
              }`} />
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentStep === 'profile' ? 'bg-diani-teal-500' : 'bg-diani-sand-300'
              }`} />
            </div>
          )}

          {/* Global Error Display */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{errors.general}</p>
              {retryCount > 0 && retryCount < MAX_RETRY_ATTEMPTS && (
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  Retry
                </Button>
              )}
            </div>
          )}

          {/* Content with transition */}
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Auth Step */}
            {currentStep === 'auth' && (
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-diani-sand-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
                    <Input
                      ref={emailRef}
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={authData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500 pl-10 transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      required
                      disabled={isAnyLoading}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-diani-sand-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
                    <Input
                      ref={passwordRef}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={authMode === 'login' ? 'Enter your password' : 'Create a strong password'}
                      value={authData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500 pl-10 pr-10 transition-colors ${
                        errors.password ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      required
                      disabled={isAnyLoading}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-diani-sand-400 hover:text-diani-sand-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {authMode === 'signup' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-diani-sand-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={authData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500 pl-10 pr-10 transition-colors ${
                            errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                          required
                          disabled={isAnyLoading}
                          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-diani-sand-400 hover:text-diani-sand-600 transition-colors"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p id="confirm-password-error" className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.confirmPassword}</span>
                        </p>
                      )}
                    </div>

                    {authData.password && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-diani-sand-700">
                          Password Requirements
                        </Label>
                        <div className="grid grid-cols-1 gap-1">
                          {validatePassword(authData.password).map((req) => (
                            <div
                              key={req.id}
                              className={`flex items-center space-x-2 text-xs transition-colors ${
                                req.valid ? 'text-green-600' : 'text-diani-sand-500'
                              }`}
                            >
                              <CheckCircle className={`h-3 w-3 ${req.valid ? 'text-green-600' : 'text-diani-sand-300'}`} />
                              <span>{req.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  disabled={!isFormValid() || isAnyLoading}
                  className="w-full bg-diani-teal-500 hover:bg-diani-teal-700 text-white rounded-full py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingStates.login ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : loadingStates.signup ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    authMode === 'login' ? 'Sign In' : 'Continue'
                  )}
                </Button>

                {/* Google Sign-in */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-diani-sand-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-diani-sand-50 px-2 text-diani-sand-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isAnyLoading}
                  className="w-full border-diani-sand-300 text-diani-sand-700 hover:bg-diani-sand-50 rounded-full py-3 font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {loadingStates.googleAuth ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <>
                      <Chrome className="h-4 w-4 mr-2" />
                      Sign in with Google
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-sm text-diani-sand-600 hover:text-diani-teal-700 transition-colors"
                    disabled={isAnyLoading}
                  >
                    {authMode === 'login'
                      ? "Don't have an account? Create one"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            )}

            {/* Profile Step */}
            {currentStep === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleStepTransition('auth')}
                  className="flex items-center space-x-1 text-diani-sand-600 hover:text-diani-teal-700 p-0 h-auto transition-colors"
                  disabled={isAnyLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-diani-sand-700">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
                    <Input
                      ref={usernameRef}
                      id="username"
                      type="text"
                      placeholder="SafariExplorer"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500 pl-10 transition-colors ${
                        errors.username ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      required
                      disabled={isAnyLoading}
                      aria-describedby={errors.username ? 'username-error' : undefined}
                    />
                    {errors.username && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.username && (
                    <p id="username-error" className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.username}</span>
                    </p>
                  )}
                  <p className="text-xs text-diani-sand-500">
                    This will be your display name. You can change it later.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelStyle" className="text-sm font-medium text-diani-sand-700">
                    Travel Style
                  </Label>
                  <Select
                    value={profileData.travelStyle}
                    onValueChange={(value: UserProfile['travelStyle']) => 
                      setProfileData(prev => ({ ...prev, travelStyle: value }))
                    }
                    disabled={isAnyLoading}
                  >
                    <SelectTrigger className="bg-white border-diani-sand-300 focus:border-diani-teal-500 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-diani-sand-200 max-h-60">
                      {TRAVEL_STYLES.map((style) => (
                        <SelectItem key={style.value} value={style.value} className="flex items-center space-x-2">
                          <span className="mr-2">{style.emoji}</span>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-diani-sand-500">
                    Help us recommend experiences that match your style
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-diani-sand-700">
                    Interests
                    <span className="text-xs text-diani-sand-500 ml-1">
                      (Select {profileData.interests.length > 0 ? `${profileData.interests.length}` : 'any'} that apply)
                    </span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        disabled={isAnyLoading}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 text-left hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                          profileData.interests.includes(interest)
                            ? 'bg-diani-teal-500 text-white border-diani-teal-500 shadow-md'
                            : 'bg-white text-diani-sand-700 border-diani-sand-300 hover:border-diani-teal-500 hover:bg-diani-teal-50'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          {interest}
                          {profileData.interests.includes(interest) && (
                            <CheckCircle className="h-3 w-3 ml-1" />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                  {profileData.interests.length === 0 && (
                    <p className="text-xs text-diani-sand-500 italic">
                      Select at least one interest to get personalized recommendations
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage" className="text-sm font-medium text-diani-sand-700">
                    Preferred Language
                  </Label>
                  <Select
                    value={profileData.preferredLanguage}
                    onValueChange={(value: string) => 
                      setProfileData(prev => ({ ...prev, preferredLanguage: value }))
                    }
                    disabled={isAnyLoading}
                  >
                    <SelectTrigger className="bg-white border-diani-sand-300 focus:border-diani-teal-500 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-diani-sand-200">
                      <SelectItem value="English">🇺🇸 English</SelectItem>
                      <SelectItem value="Spanish">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="French">🇫🇷 French</SelectItem>
                      <SelectItem value="German">🇩🇪 German</SelectItem>
                      <SelectItem value="Italian">🇮🇹 Italian</SelectItem>
                      <SelectItem value="Portuguese">🇵🇹 Portuguese</SelectItem>
                      <SelectItem value="Swahili">🇰🇪 Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Profile Summary */}
                <div className="bg-diani-sand-100 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-diani-sand-800">Profile Summary</h4>
                  <div className="text-sm text-diani-sand-600 space-y-1">
                    <p><span className="font-medium">Username:</span> {profileData.username || 'Not set'}</p>
                    <p><span className="font-medium">Travel Style:</span> {TRAVEL_STYLES.find(s => s.value === profileData.travelStyle)?.label}</p>
                    <p><span className="font-medium">Interests:</span> {profileData.interests.length > 0 ? profileData.interests.join(', ') : 'None selected'}</p>
                    <p><span className="font-medium">Language:</span> {profileData.preferredLanguage}</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid() || isAnyLoading}
                  className="w-full bg-diani-teal-500 hover:bg-diani-teal-700 text-white rounded-full py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingStates.signup ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </Button>

                {/* Terms and Privacy */}
                <div className="text-center">
                  <p className="text-xs text-diani-sand-500">
                    By creating an account, you agree to our{' '}
                    <button
                      type="button"
                      className="text-diani-teal-600 hover:text-diani-teal-700 underline transition-colors"
                      onClick={() => {
                        // Handle terms of service
                        console.log('Open Terms of Service');
                      }}
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      className="text-diani-teal-600 hover:text-diani-teal-700 underline transition-colors"
                      onClick={() => {
                        // Handle privacy policy
                        console.log('Open Privacy Policy');
                      }}
                    >
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isEmailVerificationModalOpen}
        onClose={() => setIsEmailVerificationModalOpen(false)}
        email={pendingVerificationEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
};