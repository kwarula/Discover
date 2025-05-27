
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div
      className={cn(
        "flex mb-6 animate-fade-in",
        message.isUser ? "justify-end" : "justify-start",
        isLatest && (message.isUser ? "animate-slide-in-right" : "animate-slide-in-left")
      )}
      role="log"
      aria-live="polite"
    >
      <div className={cn(
        "max-w-[75%] px-4 py-3 rounded-2xl font-inter text-base leading-6",
        message.isUser
          ? "bg-diani-sand-800 text-diani-sand-50 rounded-br-md"
          : "bg-gradient-to-br from-diani-teal-500 to-diani-teal-700 text-diani-sand-50 rounded-bl-md shadow-sm"
      )}>
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div className={cn(
          "text-xs mt-2 opacity-75 font-inter",
          message.isUser ? "text-diani-sand-200" : "text-diani-sand-100"
        )}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
