import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';
import { MessageFeedback } from './MessageFeedback';
import { ContentFilter } from './ContentFilter';
import { FilterOptions, SortOptions } from '@/types';
import { HotelCard } from './cards/HotelCard';
import { RestaurantCard } from './cards/RestaurantCard';
import { ActivityCard } from './cards/ActivityCard';
import { TransportCard } from './cards/TransportCard';
import { MapView } from './MapView';
import { TransportMap } from './TransportMap';
import { SuggestionCard } from './cards/SuggestionCard';
import { Transport } from '@/types/transport';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
  userId?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest, userId }) => {
  const markdownComponents: Components = {
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-diani-teal-600 hover:text-diani-teal-700 underline font-medium transition-colors cursor-pointer"
        {...props}
      >
        {children}
      </a>
    )
  };

  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [originalData, setOriginalData] = React.useState<any[]>([]);

  const parseRating = (ratingStr: string): number => {
    const match = ratingStr?.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const getPriceLevelFromRange = (priceRange: string): 1 | 2 | 3 | 4 => {
    const match = priceRange?.match(/(\d+)-(\d+)/);
    const price = match ? parseInt(match[2]) : parseInt(priceRange?.match(/(\d+)/)?.[1] || '0');
    if (price < 1000) return 1;
    if (price < 2500) return 2;
    if (price < 5000) return 3;
    return 4;
  };

  React.useEffect(() => {
    if (message.richContent && Array.isArray(message.richContent.data)) {
      setOriginalData(message.richContent.data);
      setFilteredData(message.richContent.data);
    }
  }, [message.richContent]);

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const extractPrice = (item: any): number => {
    const priceStr = item.price || item.price_range || '';
    return parseInt(priceStr.match(/(\d+)/)?.[1] || '0');
  };

  const extractDistance = (item: any): number => {
    const match = item.distance?.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...originalData];
    if (filters.priceRange) {
      filtered = filtered.filter(item => {
        const price = extractPrice(item);
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }
    if (filters.rating) {
      filtered = filtered.filter(item => (item.rating || item.driverRating || 0) >= filters.rating.min);
    }
    if (filters.amenities?.length) {
      filtered = filtered.filter(item => {
        const amenities = item.amenities || item.facilities || item.highlights || [];
        return filters.amenities.some((a: string) => amenities.some((b: string) => b.toLowerCase().includes(a.toLowerCase())));
      });
    }
    if (filters.cuisine?.length) {
      filtered = filtered.filter(item => filters.cuisine.some(c => item.cuisine?.toLowerCase().includes(c.toLowerCase())));
    }
    if (filters.difficulty?.length) {
      filtered = filtered.filter(item => filters.difficulty.includes(item.difficulty));
    }
    setFilteredData(filtered);
  };

  const handleSortChange = (sort: SortOptions) => {
    const sorted = [...filteredData].sort((a, b) => {
      const getValue = (item: any) => {
        switch (sort.field) {
          case 'rating': return item.rating || item.driverRating || 0;
          case 'price': return extractPrice(item);
          case 'distance': return extractDistance(item);
          case 'popularity': return item.popularity || item.rating || 0;
          default: return 0;
        }
      };
      return sort.direction === 'asc' ? getValue(a) - getValue(b) : getValue(b) - getValue(a);
    });
    setFilteredData(sorted);
  };

  const renderContent = () => {
    if (!message.richContent) {
      return (
        <ReactMarkdown className="prose prose-sm max-w-none" components={markdownComponents}>
          {message.text}
        </ReactMarkdown>
      );
    }

    const { type, data } = message.richContent;
    const plural = ['hotels', 'restaurants', 'activities', 'transports'];

    if (type === 'suggestion') {
      return <SuggestionCard text={message.text} />;
    }

    if (type === 'hotel') return <HotelCard {...data} />;
    if (type === 'activity') return <ActivityCard {...data} />;
    if (type === 'transport') return <TransportCard transport={data} onCall={() => {}} onBook={() => {}} />;
    if (type === 'map') return <MapView locations={data} />;

    if (plural.includes(type)) {
      const items = filteredData.length ? filteredData : data;
      const contentType = type.slice(0, -1) as 'hotel' | 'restaurant' | 'activity';

      return (
        <div className="space-y-4">
          <p className="text-diani-sand-800 mb-2">{message.text}</p>
          {data.length > 2 && (
            <ContentFilter
              contentType={type}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              className="mb-4"
            />
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item: any, idx: number) => {
              if (type === 'hotels') return <HotelCard key={idx} {...item} />;
              if (type === 'restaurants') return <RestaurantCard key={idx} {...item} />;
              if (type === 'activities') return <ActivityCard key={idx} {...item} />;
              if (type === 'transports') return <TransportCard key={idx} transport={item} onCall={() => {}} onBook={() => {}} />;
              return null;
            })}
          </div>
        </div>
      );
    }

    return (
      <ReactMarkdown className="prose prose-sm max-w-none" components={markdownComponents}>
        {message.text}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={cn(
        'flex mb-4 animate-fade-in',
        message.isUser ? 'justify-end' : 'justify-start',
        isLatest && (message.isUser ? 'animate-slide-in-right' : 'animate-slide-in-left')
      )}
      role="log"
      aria-live="polite"
    >
      <div
        className={cn(
          'px-5 py-4 rounded-2xl font-inter text-base leading-relaxed transition-all duration-200',
          message.isUser
            ? 'max-w-[75%] glass-dark text-diani-sand-900 rounded-br-md shadow-lg hover:scale-[1.02]'
            : message.richContent
              ? 'max-w-[90%]'
              : 'max-w-[75%] glass bg-gradient-to-br from-white/90 to-white/70 text-diani-sand-800 rounded-bl-md shadow-lg border border-white/50 hover:scale-[1.02]'
        )}
      >
        {renderContent()}
        <div className="text-xs mt-3 font-inter flex items-center gap-2 text-diani-sand-600">
          <span>{formatTime(message.timestamp)}</span>
          {!message.isUser && <span className="text-diani-teal-600">• Diani AI</span>}
        </div>
        {!message.isUser && userId && (
          <MessageFeedback messageId={message.id} userId={userId} className="mt-2" />
        )}
      </div>
    </div>
  );
};
