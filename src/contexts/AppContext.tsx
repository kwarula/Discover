
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, UserProfile } from '@/types';

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
  const [userId] = useState(() => 
    localStorage.getItem('diani-user-id') || 
    'user-' + Math.random().toString(36).substr(2, 9)
  );

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: "Hello! I'm your Diani Concierge AI. How can I help you discover the magic of Diani today? Try asking: 'Where can I find the best sunsets?'",
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

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('diani-user-profile');
    if (savedProfile) {
      try {
        setUserProfileState(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
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
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
