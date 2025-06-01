import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { SignupModal } from '@/components/SignupModal';
import { ProfileModal } from '@/components/ProfileModal';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ProactiveSuggestions } from '@/components/ProactiveSuggestions';
import { sendChatMessage } from '@/services/chatApi';
import { ChatMessage as ChatMessageType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { generateProactiveSuggestions } from '@/services/suggestionService';
import { getWeatherData, WeatherData } from '@/services/weatherApi';

const ChatInterface: React.FC = () => {
  const {
    messages,
    addMessage,
    userProfile,
    userId,
    isLoading,
    setIsLoading,
  } = useAppContext();
  
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Get user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getWeatherData();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate proactive suggestions
  const proactiveSuggestions = useMemo(() => {
    return generateProactiveSuggestions({
      userProfile,
      weatherData,
      chatMessages: messages,
      currentTime: new Date()
    });
  }, [userProfile, weatherData, messages]);

  const handleSendMessage = async (messageText: string) => {
    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Show typing indicator
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Send to API with user location if available
      const requestData = {
        message: messageText,
        userId,
        userProfile: userProfile || undefined,
        ...(userLocation && { userLocation })
      };

      const response = await sendChatMessage(requestData);

      // Simulate realistic response time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

      // Create message using the response from the webhook
      const aiMessage: ChatMessageType = {
        id: `ai-${Date.now()}`,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
      };
      
      // If the response includes rich content, add it to the message
      if (response.richContent) {
        aiMessage.richContent = response.richContent;
        
        // If it's transport data, include user location
        if (response.richContent.type === 'transports' && userLocation) {
          (aiMessage.richContent as any).userLocation = userLocation;
        }
      }
      
      addMessage(aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Connection Error",
        description: "Unable to send message. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    handleSendMessage(query);
  };

  // Determine background class based on current time of day
  const timeBasedBackground = useMemo(() => {
    const currentHour = new Date().getHours();
    
    // Morning: 5:00 - 11:59
    if (currentHour >= 5 && currentHour < 12) {
      return 'morning-background';
    }
    // Noon: 12:00 - 16:59
    else if (currentHour >= 12 && currentHour < 17) {
      return 'noon-background';
    }
    // Late afternoon: 17:00 - 19:59
    else if (currentHour >= 17 && currentHour < 20) {
      return 'late-afternoon-background';
    }
    // Evening: 20:00 - 4:59
    else {
      return 'evening-background';
    }
  }, []);

  return (
    <div className={`flex flex-col h-screen time-based-background ${timeBasedBackground}`}>
      <Header />
      
      {/* Chat Messages Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full max-w-5xl mx-auto px-4 py-6 flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar smooth-scroll">
            <div className="space-y-4 pb-4">
              {/* Proactive Suggestions */}
              <ProactiveSuggestions 
                suggestions={proactiveSuggestions}
                onSuggestionClick={handleSendMessage} 
              />
              
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="mt-6">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading || isTyping}
            />
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onActionClick={handleQuickAction} />

      {/* Modals */}
      <SignupModal />
      <ProfileModal />
    </div>
  );
};

const ChatPage: React.FC = () => {
  return <ChatInterface />;
};

export default ChatPage;