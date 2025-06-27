
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
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
  const [currentTransports, setCurrentTransports] = useState<Transport[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);

  useEffect(() => {
    if (message.richContent && message.richContent.type === 'transports') {
      const initialTransports = message.richContent.data as Transport[];
      setCurrentTransports(initialTransports);

      // Ensure a unique channel per message if needed, or a general one.
      // For simplicity, using a general channel name. Consider message ID for specific channels.
      const channelId = `transports-message-${message.id}`;
      channelRef.current = supabase.channel(channelId);

      channelRef.current
        .on('broadcast', { event: 'transport-update' }, (payload) => {
          console.log(`Transport update received for message ${message.id}:`, payload);
          if (payload.payload && Array.isArray(payload.payload.transports)) {
            // Here, you might want to merge or replace transports based on your app's logic
            // For now, replacing the entire list.
            setCurrentTransports(payload.payload.transports);
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to ${channelId}`);
          }
        });
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        console.log(`Unsubscribed from ${channelRef.current.topic}`);
        channelRef.current = null;
      }
    };
  }, [message.id, message.richContent]);


  const handleTransportSelect = (transport: Transport) => {
    setSelectedTransport(transport);
    // Potentially send a message or perform an action
    console.log('Transport selected in ChatMessage:', transport);
  };

  const renderContent = () => {
    if (message.richContent) {
      switch (message.richContent.type) {
        case 'hotel':
          return <HotelCard {...message.richContent.data} />;
        // ... other cases for hotel, restaurant, activity, map ...
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
        case 'transport': // Single transport card
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
              <TransportCard
                transport={message.richContent.data as Transport}
                onCall={(transport) => window.open(`tel:${transport.driverPhone}`)}
                onBook={(transport) => console.log('Booking transport:', transport)}
              />
            </div>
          );
        case 'transports': // Multiple transports with map and cards
          const userLocation = (message.richContent as any).userLocation;
          // Use currentTransports state for rendering
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
              <TransportMap
                // Pass currentTransports which updates from WebSocket
                initialTransports={currentTransports}
                userLocation={userLocation}
                onTransportSelect={handleTransportSelect}
                selectedTransport={selectedTransport}
              />
              <div className="grid gap-4 md:grid-cols-2">
                {currentTransports.map((transport: Transport) => (
                  <TransportCard
                    key={transport.id}
                    transport={transport}
                    isSelected={selectedTransport?.id === transport.id}
                    onCall={(t) => window.open(`tel:${t.driverPhone}`)}
                    onBook={(t) => console.log('Booking transport:', t)}
                    onClick={() => handleTransportSelect(transport)}
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
