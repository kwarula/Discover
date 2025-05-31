
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { LoginModal } from '@/components/LoginModal';
import { ProfileModal } from '@/components/ProfileModal';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { sendChatMessage } from '@/services/chatApi';
import { ChatMessage as ChatMessageType } from '@/types';

// Mock data for rich content demos
const mockHotels = [
  {
    name: "Baobab Beach Resort & Spa",
    rating: 4.5,
    price: "$150/night",
    location: "Diani Beach Road",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    amenities: ["WiFi", "Parking", "Breakfast", "Family"],
    description: "Luxury beachfront resort with stunning ocean views and world-class amenities."
  },
  {
    name: "Swahili Beach Resort",
    rating: 4.7,
    price: "$200/night",
    location: "South Coast",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    amenities: ["WiFi", "Parking", "Breakfast"],
    description: "Elegant resort featuring traditional Swahili architecture and modern comfort."
  }
];

const mockRestaurants = [
  {
    name: "Ali Barbour's Cave",
    cuisine: "Seafood",
    rating: 4.8,
    priceLevel: 3,
    location: "Diani Beach",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    hours: "6PM - 11PM",
    phone: "+254 123 456789",
    specialties: ["Lobster Thermidor", "Grilled Prawns", "Fresh Oysters"]
  },
  {
    name: "Sails Beach Bar",
    cuisine: "International",
    rating: 4.3,
    priceLevel: 2,
    location: "Almanara Resort",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
    hours: "11AM - 10PM",
    specialties: ["Beach BBQ", "Tropical Cocktails", "Fresh Seafood"]
  }
];

const mockActivities = [
  {
    name: "Dolphin Watching Tour",
    category: "Marine Life",
    duration: "3 hours",
    groupSize: "2-12 people",
    location: "Wasini Island",
    image: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=400",
    price: "$45/person",
    difficulty: "Easy",
    highlights: ["Dolphin spotting", "Snorkeling", "Marine park visit"],
    availability: "Daily at 6AM & 2PM"
  },
  {
    name: "Kite Surfing Lessons",
    category: "Water Sports",
    duration: "2 hours",
    groupSize: "1-4 people",
    location: "Galu Beach",
    image: "https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=400",
    price: "$80/person",
    difficulty: "Moderate",
    highlights: ["Professional instruction", "Equipment provided", "Beach location"],
    availability: "Tide dependent"
  }
];

const mockLocations = [
  { name: "Baobab Beach Resort", lat: -4.3167, lng: 39.5667, type: 'hotel' as const },
  { name: "Swahili Beach Resort", lat: -4.3200, lng: 39.5700, type: 'hotel' as const },
  { name: "Ali Barbour's Cave", lat: -4.3150, lng: 39.5650, type: 'restaurant' as const },
  { name: "Sails Beach Bar", lat: -4.3180, lng: 39.5680, type: 'restaurant' as const },
  { name: "Diani Beach", lat: -4.3100, lng: 39.5600, type: 'beach' as const },
  { name: "Galu Beach", lat: -4.3250, lng: 39.5750, type: 'beach' as const },
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

    try {
      // Send to API
      const response = await sendChatMessage({
        message: messageText,
        userId,
        userProfile: userProfile || undefined,
      });

      // Simulate realistic response time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

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
      }
      
      // For backward compatibility - if no rich content but keywords are present,
      // fallback to mock data (can be removed once webhook is fully functional)
      if (!aiMessage.richContent) {
        if (messageText.toLowerCase().includes('hotel') || messageText.toLowerCase().includes('stay')) {
          aiMessage.richContent = {
            type: 'hotels',
            data: mockHotels
          };
        } else if (messageText.toLowerCase().includes('restaurant') || messageText.toLowerCase().includes('eat') || messageText.toLowerCase().includes('dinner')) {
          aiMessage.richContent = {
            type: 'restaurants',
            data: mockRestaurants
          };
        } else if (messageText.toLowerCase().includes('activit') || messageText.toLowerCase().includes('do')) {
          aiMessage.richContent = {
            type: 'activities',
            data: mockActivities
          };
        } else if (messageText.toLowerCase().includes('map') || messageText.toLowerCase().includes('where') || messageText.toLowerCase().includes('location')) {
          aiMessage.richContent = {
            type: 'map',
            data: mockLocations
          };
        }
      }
      
      addMessage(aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Error is handled in the API service with a fallback response
    } finally {
      setIsTyping(false);
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
      <LoginModal />
      <ProfileModal />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <ChatInterface />
    </AppProvider>
  );
};

export default Index;
