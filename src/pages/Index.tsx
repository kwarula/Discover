
import React, { useRef, useEffect, useState } from 'react';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { LoginModal } from '@/components/LoginModal';
import { ProfileModal } from '@/components/ProfileModal';
import { sendChatMessage } from '@/services/chatApi';
import { ChatMessage as ChatMessageType } from '@/types';

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

      // Add AI response
      const aiMessage: ChatMessageType = {
        id: `ai-${Date.now()}`,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Error is handled in the API service with a fallback response
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-diani-sand-50 to-diani-teal-50">
      <Header />
      
      {/* Chat Messages Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-4 py-6 flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-diani-sand-300 scrollbar-track-transparent">
            <div className="space-y-0">
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
