import React, { useState } from 'react';
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
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Chrome } from 'lucide-react';

type SignupStep = 'auth' | 'profile' | 'verification';
type AuthMode = 'login' | 'signup';

export const SignupModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    setUserProfile,
    isEmailVerificationModalOpen,
    setIsEmailVerificationModalOpen,
    pendingVerificationEmail,
    setPendingVerificationEmail
  } = useAppContext();

  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [currentStep, setCurrentStep] = useState<SignupStep>('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auth form data
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Profile form data
  const [profileData, setProfileData] = useState({
    username: '',
    travelStyle: 'adventure' as UserProfile['travelStyle'],
    interests: [] as string[],
    preferredLanguage: 'English',
  });

  const resetForm = () => {
    setAuthData({ email: '', password: '', confirmPassword: '' });
    setProfileData({
      username: '',
      travelStyle: 'adventure',
      interests: [],
      preferredLanguage: 'English',
    });
    setCurrentStep('auth');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    resetForm();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(authData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (authMode === 'login') {
      if (!authData.password) {
        toast({
          title: "Password required",
          description: "Please enter your password.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        const response = await authService.login({
          email: authData.email,
          password: authData.password
        });

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
          });
          handleClose();
        } else {
          toast({
            title: "Login failed",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        toast({
          title: "Login error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Signup validation
      if (!authData.password) {
        toast({
          title: "Password required",
          description: "Please create a password.",
          variant: "destructive",
        });
        return;
      }

      if (authData.password !== authData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure both passwords are the same.",
          variant: "destructive",
        });
        return;
      }

      // Move to profile step
      setCurrentStep('profile');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const signupData: SignupData = {
        email: authData.email,
        password: authData.password,
        username: profileData.username.trim(),
        travelStyle: profileData.travelStyle,
        interests: profileData.interests,
        preferredLanguage: profileData.preferredLanguage
      };

      const response = await authService.signup(signupData);

      if (response.success) {
        setPendingVerificationEmail(authData.email);
        setIsLoginModalOpen(false);
        setIsEmailVerificationModalOpen(true);
        toast({
          title: "Account created!",
          description: response.message,
        });
      } else {
        toast({
          title: "Signup failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleVerificationSuccess = async () => {
    // User will be automatically logged in after verification
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
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await authService.signInWithGoogle();
      
      if (response.success) {
        // Google OAuth will redirect, so we don't need to do anything else here
        toast({
          title: "Redirecting to Google",
          description: "Please complete the sign-in process with Google.",
        });
      } else {
        toast({
          title: "Google Sign-in Failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Sign-in Error",
        description: "Something went wrong with Google sign-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const availableInterests = [
    'Diving', 'Snorkeling', 'Local Cuisine', 'Wildlife', 'Photography', 
    'Beach Activities', 'Cultural Experiences', 'Nightlife', 'Wellness', 'Adventure Sports'
  ];

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

  return (
    <>
      <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] bg-diani-sand-50 border-diani-sand-200 rounded-3xl max-h-[90vh] overflow-y-auto">
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
              <div className={`w-3 h-3 rounded-full ${currentStep === 'auth' ? 'bg-diani-teal-500' : 'bg-diani-sand-300'}`} />
              <div className={`w-8 h-1 ${currentStep === 'profile' ? 'bg-diani-teal-500' : 'bg-diani-sand-300'}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep === 'profile' ? 'bg-diani-teal-500' : 'bg-diani-sand-300'}`} />
            </div>
          )}

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
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={authData.email}
                    onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-diani-sand-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={authMode === 'login' ? 'Enter your password' : 'Create a strong password'}
                    value={authData.password}
                    onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500 pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-diani-sand-400 hover:text-diani-sand-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                        onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500 pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-diani-sand-400 hover:text-diani-sand-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {authData.password && (
                    <PasswordStrengthIndicator password={authData.password} />
                  )}
                </>
              )}

              <Button
            {/* Google Sign-in Button */}
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
              disabled={isLoading}
              className="w-full border-diani-sand-300 text-diani-sand-700 hover:bg-diani-sand-50 rounded-full py-3 font-medium transition-all duration-200"
            >
              <Chrome className="h-4 w-4 mr-2" />
              Sign in with Google
            </Button>

                type="submit"
                disabled={isLoading}
                className="w-full bg-diani-teal-500 hover:bg-diani-teal-700 text-white rounded-full py-3 font-medium transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{authMode === 'login' ? 'Signing in...' : 'Creating account...'}</span>

          {/* Profile Step */}
          {currentStep === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCurrentStep('auth')}
                className="flex items-center space-x-1 text-diani-sand-600 hover:text-diani-teal-700 p-0 h-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              {/* Google Sign-in Button */}
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
                disabled={isLoading}
                className="w-full border-diani-sand-300 text-diani-sand-700 hover:bg-diani-sand-50 rounded-full py-3 font-medium transition-all duration-200"
              >
                <Chrome className="h-4 w-4 mr-2" />
                Sign in with Google
              </Button>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-diani-sand-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-diani-sand-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="SafariExplorer"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500 pl-10"
                    required
                  />
                </div>
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
                >
                  <SelectTrigger className="bg-white border-diani-sand-300 focus:border-diani-teal-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-diani-sand-200">
                    <SelectItem value="adventure">Adventure Seeker</SelectItem>
                    <SelectItem value="relaxed">Relaxed Explorer</SelectItem>
                    <SelectItem value="family">Family Traveler</SelectItem>
                    <SelectItem value="luxury">Luxury Enthusiast</SelectItem>
                    <SelectItem value="budget">Budget Conscious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-diani-sand-700">
                  Interests (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                        profileData.interests.includes(interest)
                          ? 'bg-diani-teal-500 text-white border-diani-teal-500'
                          : 'bg-white text-diani-sand-700 border-diani-sand-300 hover:border-diani-teal-500'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-diani-teal-500 hover:bg-diani-teal-700 text-white rounded-full py-3 font-medium transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <EmailVerificationModal
        isOpen={isEmailVerificationModalOpen}
        onClose={() => setIsEmailVerificationModalOpen(false)}
        email={pendingVerificationEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
};
