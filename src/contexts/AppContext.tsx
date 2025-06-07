
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, UserProfile } from '@/types';
import { translate, getCurrentLanguage } from '@/services/translationService';
import { authService } from '@/services/authService';

interface AppContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  isLoggedIn: boolean;
  userId: string;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isEmailVerificationModalOpen: boolean;
  setIsEmailVerificationModalOpen: (open: boolean) => void;
  pendingVerificationEmail: string;
  setPendingVerificationEmail: (email: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [userId] = useState(() => 
    localStorage.getItem('diani-user-id') || 
    'user-' + Math.random().toString(36).substr(2, 9)
  );

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const lang = getCurrentLanguage();
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: translate('welcome', lang),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Save userId to localStorage
  useEffect(() => {
    localStorage.setItem('diani-user-id', userId);
  }, [userId]);

  // Load profile from Supabase auth service
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUserProfileState({
            username: currentUser.username,
          travelStyle: currentUser.travelStyle,
          interests: currentUser.interests,
          preferredLanguage: currentUser.preferredLanguage
        });
      }
    } catch (error) {
        console.error("Failed to load current user on initial load:", error);
        // Optionally, set userProfile to null or handle error state
        setUserProfileState(null);
      }
    };

    loadCurrentUser();

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      if (user) {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUserProfileState({
              username: currentUser.username,
              travelStyle: currentUser.travelStyle,
              interests: currentUser.interests,
              preferredLanguage: currentUser.preferredLanguage
            });
          } else {
            // This case might occur if the user exists in auth but not in the profile table
            setUserProfileState(null);
          }
        } catch (error) {
          console.error("Failed to load current user on auth state change:", error);
          setUserProfileState(null);
        }
      } else {
        setUserProfileState(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
    if (profile) {
      localStorage.setItem('diani-user-profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('diani-user-profile');
    }
  };

  const logout = () => {
    authService.logout();
    setUserProfileState(null);
    setMessages([]);
    // Reinitialize with welcome message
    const lang = getCurrentLanguage();
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      text: translate('welcome', lang),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const isLoggedIn = userProfile !== null;

  const value = {
    messages,
    addMessage,
    userProfile,
    setUserProfile,
    isLoggedIn,
    userId,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isLoading,
    setIsLoading,
    isEmailVerificationModalOpen,
    setIsEmailVerificationModalOpen,
    pendingVerificationEmail,
    setPendingVerificationEmail,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
