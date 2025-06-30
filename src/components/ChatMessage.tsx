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
import { Transport } from '@/types/transport';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
  userId?: string;
}

// Enhanced interface for webhook structured responses
interface WebhookResponse {
  text: string;
  isUser: boolean;
  timestamp: string;
  richContent?: {
    type: 'suggestion' | 'hotel' | 'restaurant' | 'activity' | 'hotels' | 'restaurants' | 'activities' | 'map' | 'transport' | 'transports';
    data: any;
  };
}

// Suggestion card component for rendering AI suggestions
const SuggestionCard: React.FC<{ suggestions: string[] }> = ({ suggestions }) => (
  <div className="bg-gradient-to-br from-diani-teal-50 to-diani-blue-50 border border-diani-teal-200 rounded-lg p-4 mt-2">
    <h4 className="text-sm font-semibold text-diani-teal-800 mb-2">💡 Suggestions</h4>
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <div 
          key={index}
          className="flex items-start gap-2 p-2 bg-white/60 rounded-md hover:bg-white/80 transition-colors cursor-pointer"
          onClick={() => {
            // Trigger suggestion as new user message
            const event = new CustomEvent('suggestion-selected', { 
              detail: { suggestion } 
            });
            window.dispatchEvent(event);
          }}
        >
          <span className="text-diani-teal-600 text-xs mt-1">▸</span>
          <span className="text-sm text-diani-sand-800 flex-1">{suggestion}</span>
        </div>
      ))}
    </div>
  </div>
);

// Quick actions component for common user actions
const QuickActions: React.FC<{ actions: Array<{label: string, action: string}> }> = ({ actions }) => (
  <div className="flex flex-wrap gap-2 mt-3">
    {actions.map((action, index) => (
      <button
        key={index}
        onClick={() => {
          const event = new CustomEvent('quick-action', { 
            detail: { action: action.action } 
          });
          window.dispatchEvent(event);
        }}
        className="px-3 py-1 text-xs bg-diani-teal-100 text-diani-teal-700 rounded-full hover:bg-diani-teal-200 transition-colors"
      >
        {action.label}
      </button>
    ))}
  </div>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest, userId }) => {
  // Custom components for ReactMarkdown
  const markdownComponents: Components = {
    a: ({ href, children, ...props }) => {
      console.log('Rendering link:', { href, children });
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            console.log('Link clicked:', href);
            // Let the default behavior handle the navigation
          }}
          className="text-diani-teal-600 hover:text-diani-teal-700 underline font-medium transition-colors cursor-pointer"
          {...props}
        >
          {children}
        </a>
      );
    }
  };

  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [originalData, setOriginalData] = React.useState<any[]>([]);

  // Enhanced helper function to parse webhook response
  const parseWebhookResponse = (message: ChatMessageType): WebhookResponse | null => {
    try {
      // Check if message.text is a JSON string (from webhook)
      if (typeof message.text === 'string' && message.text.trim().startsWith('{')) {
        const parsed = JSON.parse(message.text);
        if (parsed.text && parsed.hasOwnProperty('isUser') && parsed.timestamp) {
          return parsed as WebhookResponse;
        }
      }
      return null;
    } catch (error) {
      console.log('Not a JSON webhook response, treating as regular message');
      return null;
    }
  };

  // Helper function to parse rating from string like "4.6/5"
  const parseRating = (ratingStr: string): number => {
    if (!ratingStr) return 0;
    const match = ratingStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Helper function to convert price range to price level (1-4)
  const getPriceLevelFromRange = (priceRange: string): 1 | 2 | 3 | 4 => {
    if (!priceRange) return 2;
    
    // Extract the maximum price from range like "KES 2500-5000"
    const match = priceRange.match(/(\d+)-(\d+)/);
    if (match) {
      const maxPrice = parseInt(match[2]);
      if (maxPrice < 1000) return 1;
      if (maxPrice < 2500) return 2;
      if (maxPrice < 5000) return 3;
      return 4;
    }
    
    // If no range, try to extract single price
    const singleMatch = priceRange.match(/(\d+)/);
    if (singleMatch) {
      const price = parseInt(singleMatch[1]);
      if (price < 1000) return 1;
      if (price < 2500) return 2;
      if (price < 5000) return 3;
      return 4;
    }
    
    return 2; // Default to moderate
  };

  // Initialize data when message changes
  React.useEffect(() => {
    const webhookResponse = parseWebhookResponse(message);
    const richContent = webhookResponse?.richContent || message.richContent;
    
    if (richContent && Array.isArray(richContent.data)) {
      setOriginalData(richContent.data);
      setFilteredData(richContent.data);
    }
  }, [message]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Enhanced time formatting to handle webhook timestamp strings
  const formatWebhookTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatTime(date);
    } catch {
      return formatTime(new Date());
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...originalData];

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(item => {
        const price = extractPrice(item);
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
    }

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(item => {
        const rating = item.rating || item.driverRating || 0;
        return rating >= filters.rating!.min;
      });
    }

    // Apply amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(item => {
        const itemAmenities = item.amenities || item.facilities || item.highlights || [];
        return filters.amenities!.some(amenity => 
          itemAmenities.some((itemAmenity: string) => 
            itemAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    // Apply cuisine filter (restaurants)
    if (filters.cuisine && filters.cuisine.length > 0) {
      filtered = filtered.filter(item => {
        const itemCuisine = item.cuisine || '';
        return filters.cuisine!.some(cuisine => 
          itemCuisine.toLowerCase().includes(cuisine.toLowerCase())
        );
      });
    }

    // Apply difficulty filter (activities)
    if (filters.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter(item => {
        return filters.difficulty!.includes(item.difficulty);
      });
    }

    setFilteredData(filtered);
  };

  const handleSortChange = (sort: SortOptions) => {
    const sorted = [...filteredData].sort((a, b) => {
      let aValue, bValue;

      switch (sort.field) {
        case 'rating':
          aValue = a.rating || a.driverRating || 0;
          bValue = b.rating || b.driverRating || 0;
          break;
        case 'price':
          aValue = extractPrice(a);
          bValue = extractPrice(b);
          break;
        case 'distance':
          aValue = extractDistance(a);
          bValue = extractDistance(b);
          break;
        case 'popularity':
          aValue = a.popularity || a.rating || 0;
          bValue = b.popularity || b.rating || 0;
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredData(sorted);
  };

  const extractPrice = (item: any): number => {
    if (item.pricePerNight) return item.pricePerNight;
    if (item.priceValue) return item.priceValue;
    if (item.fare?.amount) return item.fare.amount;
    
    // Extract from price string
    const priceStr = item.price || item.price_range || '';
    const match = priceStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const extractDistance = (item: any): number => {
    if (!item.distance) return 0;
    const match = item.distance.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Enhanced content rendering with webhook support
  const renderContent = () => {
    // First, check if this is a webhook response
    const webhookResponse = parseWebhookResponse(message);
    
    // Use webhook richContent if available, otherwise use message richContent
    const richContent = webhookResponse?.richContent || message.richContent;
    const textContent = webhookResponse?.text || message.text;

    // Handle webhook suggestion type
    if (richContent?.type === 'suggestion') {
      const suggestionData = richContent.data;
      
      return (
        <div className="space-y-3">
          <ReactMarkdown 
            className="prose prose-sm max-w-none prose-headings:text-diani-sand-900 prose-p:text-diani-sand-800 prose-strong:text-diani-sand-900"
            components={markdownComponents}
          >
            {textContent}
          </ReactMarkdown>
          
          {/* Render suggestions if available */}
          {suggestionData?.suggestions && Array.isArray(suggestionData.suggestions) && (
            <SuggestionCard suggestions={suggestionData.suggestions} />
          )}
          
          {/* Render quick actions if available */}
          {suggestionData?.quickActions && Array.isArray(suggestionData.quickActions) && (
            <QuickActions actions={suggestionData.quickActions} />
          )}
          
          {/* Render location highlights */}
          {suggestionData?.highlights && Array.isArray(suggestionData.highlights) && (
            <div className="bg-gradient-to-r from-diani-blue-50 to-diani-teal-50 border border-diani-blue-200 rounded-lg p-3 mt-2">
              <h4 className="text-sm font-semibold text-diani-blue-800 mb-2">🏖️ Local Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {suggestionData.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="text-xs text-diani-sand-700 flex items-center gap-1">
                    <span className="text-diani-blue-500">•</span>
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Render weather info if available */}
          {suggestionData?.weather && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <h4 className="text-sm font-semibold text-orange-800 mb-1">🌤️ Current Weather</h4>
              <p className="text-sm text-orange-700">{suggestionData.weather}</p>
            </div>
          )}
        </div>
      );
    }

    // Handle other rich content types (existing logic)
    if (richContent) {
      switch (richContent.type) {
        case 'hotel':
          return <HotelCard {...richContent.data} />;
        case 'restaurant':
          // Handle single restaurant from webhook
          if (richContent.data && richContent.data.recommendations) {
            const recommendations = richContent.data.recommendations;
            if (Array.isArray(recommendations) && recommendations.length > 1) {
              const mappedRestaurants = recommendations.map((item: any, index: number) => ({
                id: item.name || `restaurant-${index}`,
                name: item.name || 'Unknown Restaurant',
                cuisine: item.cuisine || 'International',
                rating: parseRating(item.rating || '0'),
                priceLevel: getPriceLevelFromRange(item.price_range || ''),
                location: item.location || 'Diani Beach',
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                hours: item.hours || 'N/A',
                phone: item.contact || undefined,
                specialties: Array.isArray(item.highlights) ? item.highlights : []
              }));

              return (
                <div className="space-y-4">
                  <p className="text-diani-sand-800 mb-4">{textContent}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mappedRestaurants.map((restaurant: any) => (
                      <RestaurantCard key={restaurant.id} {...restaurant} />
                    ))}
                  </div>
                </div>
              );
            } else if (recommendations.length === 1) {
              const item = recommendations[0];
              const mappedRestaurant = {
                id: item.name || 'restaurant-1',
                name: item.name || 'Unknown Restaurant',
                cuisine: item.cuisine || 'International',
                rating: parseRating(item.rating || '0'),
                priceLevel: getPriceLevelFromRange(item.price_range || ''),
                location: item.location || 'Diani Beach',
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                hours: item.hours || 'N/A',
                phone: item.contact || undefined,
                specialties: Array.isArray(item.highlights) ? item.highlights : []
              };
              return <RestaurantCard {...mappedRestaurant} />;
            }
          }
          return <RestaurantCard {...richContent.data} />;
        case 'activity':
          return <ActivityCard {...richContent.data} />;
        case 'hotels':
        case 'restaurants':
        case 'activities':
          const contentType = richContent.type.replace('s', '') as 'hotel' | 'restaurant' | 'activity';
          
          let rawData: any[] = [];
          if (richContent.type === 'restaurants' && richContent.data && richContent.data.recommendations) {
            rawData = richContent.data.recommendations.map((item: any, index: number) => ({
              id: item.name || `restaurant-${index}`,
              name: item.name || 'Unknown Restaurant',
              cuisine: item.cuisine || 'International',
              rating: parseRating(item.rating || '0'),
              priceLevel: getPriceLevelFromRange(item.price_range || ''),
              location: item.location || 'Diani Beach',
              image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              hours: item.hours || 'N/A',
              phone: item.contact || undefined,
              specialties: Array.isArray(item.highlights) ? item.highlights : []
            }));
          } else {
            rawData = Array.isArray(richContent.data) ? richContent.data : [];
          }
          
          const dataToRender = filteredData.length > 0 ? filteredData : rawData;
          
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{textContent}</p>
              
              {rawData.length > 2 && (
                <ContentFilter
                  contentType={contentType === 'hotel' ? 'hotels' : contentType === 'restaurant' ? 'restaurants' : 'activities'}
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                  className="mb-4"
                />
              )}
              
              {filteredData.length !== originalData.length && originalData.length > 0 && (
                <p className="text-sm text-diani-sand-600 mb-2">
                  Showing {filteredData.length} of {originalData.length} results
                </p>
              )}
              
              {dataToRender.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {dataToRender.map((item: any, index: number) => {
                    switch (richContent.type) {
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
              ) : (
                <div className="text-center py-8 text-diani-sand-600">
                  <p>No results found matching your criteria.</p>
                </div>
              )}
            </div>
          );
        case 'map':
          let locationsForMap: any[] = [];
          
          if (Array.isArray(richContent.data)) {
            locationsForMap = richContent.data;
          } else if (richContent.data && Array.isArray(richContent.data.highlights)) {
            const baseLocation = richContent.data.location || "Diani Beach, Kenya";
            const baseLat = -4.3167;
            const baseLng = 39.5667;
            
            locationsForMap = richContent.data.highlights.map((highlight: string, index: number) => ({
              name: highlight,
              lat: baseLat + (index * 0.01),
              lng: baseLng + (index * 0.01),
              type: 'beach' as const
            }));
          }
          
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{textContent}</p>
              {locationsForMap.length > 0 ? (
                <MapView locations={locationsForMap} />
              ) : (
                <div className="text-center py-8 text-diani-sand-600">
                  <p>No map data available.</p>
                </div>
              )}
            </div>
          );
        case 'transport':
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{textContent}</p>
              <TransportCard 
                transport={richContent.data} 
                onCall={(transport) => window.open(`tel:${transport.driverPhone}`)}
                onBook={(transport) => console.log('Booking transport:', transport)}
              />
            </div>
          );
        case 'transports':
          const transports = Array.isArray(richContent.data) ? richContent.data as Transport[] : [];
          const userLocation = (richContent as any).userLocation;
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{textContent}</p>
              {transports.length > 0 ? (
                <>
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
                </>
              ) : (
                <div className="text-center py-8 text-diani-sand-600">
                  <p>No transport options available at the moment.</p>
                </div>
              )}
            </div>
          );
        default:
          return (
            <ReactMarkdown 
              className="prose prose-sm max-w-none prose-headings:text-diani-sand-900 prose-p:text-diani-sand-800 prose-strong:text-diani-sand-900"
              components={markdownComponents}
            >
              {textContent}
            </ReactMarkdown>
          );
      }
    }

    // Default: render as markdown
    return (
      <ReactMarkdown 
        className="prose prose-sm max-w-none prose-headings:text-diani-sand-900 prose-p:text-diani-sand-800 prose-strong:text-diani-sand-900"
        components={markdownComponents}
      >
        {textContent}
      </ReactMarkdown>
    );
  };

  // Determine message properties (handle webhook vs regular messages)
  const webhookResponse = parseWebhookResponse(message);
  const isUserMessage = webhookResponse?.isUser ?? message.isUser;
  const timestamp = webhookResponse?.timestamp ? formatWebhookTime(webhookResponse.timestamp) : formatTime(message.timestamp);

  return (
    <div
      className={cn(
        "flex mb-4 animate-fade-in",
        isUserMessage ? "justify-end" : "justify-start",
        isLatest && (isUserMessage ? "animate-slide-in-right" : "animate-slide-in-left")
      )}
      role="log"
      aria-live="polite"
    >
      <div className={cn(
        "px-5 py-4 rounded-2xl font-inter text-base leading-relaxed transition-all duration-200",
        isUserMessage
          ? "max-w-[75%] glass-dark text-diani-sand-900 rounded-br-md shadow-lg hover:scale-[1.02]"
          : (webhookResponse?.richContent || message.richContent)
            ? "max-w-[90%]" 
            : "max-w-[75%] glass bg-gradient-to-br from-white/90 to-white/70 text-diani-sand-800 rounded-bl-md shadow-lg border border-white/50 hover:scale-[1.02]"
      )}>
        {renderContent()}
        <div className={cn(
          "text-xs mt-3 font-inter flex items-center gap-2",
          isUserMessage ? "text-diani-sand-600" : "text-diani-sand-600"
        )}>
          <span>{timestamp}</span>
          {!isUserMessage && (
            <span className="text-diani-teal-600">• Diani AI</span>
          )}
        </div>
        
        {/* Add feedback for AI messages */}
        {!isUserMessage && userId && (
          <MessageFeedback
            messageId={message.id}
            userId={userId}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};