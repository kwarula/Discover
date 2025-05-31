
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';
import { HotelCard } from './cards/HotelCard';
import { RestaurantCard } from './cards/RestaurantCard';
import { ActivityCard } from './cards/ActivityCard';
import { TransportCard } from './cards/TransportCard';
import { MapView } from './MapView';
import { TransportMap } from './TransportMap';
import { Transport } from '@/types/transport';

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

  // Check if message contains rich content
  const renderContent = () => {
    // Check for special card markers in the message
    if (message.richContent) {
      switch (message.richContent.type) {
        case 'hotel':
          return <HotelCard {...message.richContent.data} />;
        case 'restaurant':
          return <RestaurantCard {...message.richContent.data} />;
        case 'activity':
          return <ActivityCard {...message.richContent.data} />;
        case 'hotels':
        case 'restaurants':
        case 'activities':
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {message.richContent.data.map((item: any, index: number) => {
                  switch (message.richContent.type) {
                    case 'hotels':
                      return <HotelCard key={index} {...item} />;
                    case 'restaurants':
                      return <RestaurantCard key={index} {...item} />;
                    case 'activities':
                      return <ActivityCard key={index} {...item} />;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          );
        case 'map':
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
              <MapView locations={message.richContent.data} />
            </div>
          );
        case 'transport':
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
              <TransportCard 
                transport={message.richContent.data} 
                onCall={(transport) => window.open(`tel:${transport.driverPhone}`)}
                onBook={(transport) => console.log('Booking transport:', transport)}
              />
            </div>
          );
        case 'transports':
          const transports = message.richContent.data as Transport[];
          const userLocation = (message.richContent as any).userLocation;
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
              <TransportMap 
                transports={transports}
                userLocation={userLocation}
                onTransportSelect={(transport) => console.log('Selected transport:', transport)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                {transports.map((transport: Transport) => (
                  <TransportCard 
                    key={transport.id}
                    transport={transport}
                    onCall={(t) => window.open(`tel:${t.driverPhone}`)}
                    onBook={(t) => console.log('Booking transport:', t)}
                  />
                ))}
              </div>
            </div>
          );
        default:
          return <p className="whitespace-pre-wrap break-words">{message.text}</p>;
      }
    }

    return <p className="whitespace-pre-wrap break-words">{message.text}</p>;
  };

  return (
    <div
      className={cn(
        "flex mb-4 animate-fade-in",
        message.isUser ? "justify-end" : "justify-start",
        isLatest && (message.isUser ? "animate-slide-in-right" : "animate-slide-in-left")
      )}
      role="log"
      aria-live="polite"
    >
      <div className={cn(
        "px-5 py-4 rounded-2xl font-inter text-base leading-relaxed transition-all duration-200",
        message.isUser
          ? "max-w-[75%] glass-dark text-white rounded-br-md shadow-lg hover:scale-[1.02]"
          : message.richContent 
            ? "max-w-[90%]" 
            : "max-w-[75%] glass bg-gradient-to-br from-white/90 to-white/70 text-diani-sand-800 rounded-bl-md shadow-lg border border-white/50 hover:scale-[1.02]"
      )}>
        {renderContent()}
        <div className={cn(
          "text-xs mt-3 font-inter flex items-center gap-2",
          message.isUser ? "text-white/70" : "text-diani-sand-600"
        )}>
          <span>{formatTime(message.timestamp)}</span>
          {!message.isUser && (
            <span className="text-diani-teal-600">• Diani AI</span>
          )}
        </div>
      </div>
    </div>
  );
};
