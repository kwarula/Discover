import React from 'react';
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

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest, userId }) => {
  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [originalData, setOriginalData] = React.useState<any[]>([]);

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
    if (message.richContent && Array.isArray(message.richContent.data)) {
      setOriginalData(message.richContent.data);
      setFilteredData(message.richContent.data);
    }
  }, [message.richContent]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
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

  // Check if message contains rich content
  const renderContent = () => {
    // Check for special card markers in the message
    if (message.richContent) {
      switch (message.richContent.type) {
        case 'hotel':
          return <HotelCard {...message.richContent.data} />;
        case 'restaurant':
          // Handle single restaurant from webhook
          if (message.richContent.data && message.richContent.data.recommendations) {
            // If there are multiple recommendations, treat as restaurants (plural)
            const recommendations = message.richContent.data.recommendations;
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
                  <p className="text-diani-sand-800 mb-4">{message.text}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mappedRestaurants.map((restaurant: any) => (
                      <RestaurantCard key={restaurant.id} {...restaurant} />
                    ))}
                  </div>
                </div>
              );
            } else if (recommendations.length === 1) {
              // Single restaurant
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
          // Fallback for direct restaurant data
          return <RestaurantCard {...message.richContent.data} />;
        case 'activity':
          return <ActivityCard {...message.richContent.data} />;
        case 'hotels':
        case 'restaurants':
        case 'activities':
          const contentType = message.richContent.type.replace('s', '') as 'hotel' | 'restaurant' | 'activity';
          
          // Handle webhook data structure for restaurants
          let rawData: any[] = [];
          if (message.richContent.type === 'restaurants' && message.richContent.data && message.richContent.data.recommendations) {
            // Map webhook restaurant data to expected format
            rawData = message.richContent.data.recommendations.map((item: any, index: number) => ({
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
            // Use data as-is if it's already an array
            rawData = Array.isArray(message.richContent.data) ? message.richContent.data : [];
          }
          
          const dataToRender = filteredData.length > 0 ? filteredData : rawData;
          
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
              
              {/* Filter Controls */}
              {rawData.length > 2 && (
                <ContentFilter
                  contentType={contentType === 'hotel' ? 'hotels' : contentType === 'restaurant' ? 'restaurants' : 'activities'}
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                  className="mb-4"
                />
              )}
              
              {/* Results count */}
              {filteredData.length !== originalData.length && originalData.length > 0 && (
                <p className="text-sm text-diani-sand-600 mb-2">
                  Showing {filteredData.length} of {originalData.length} results
                </p>
              )}
              
              {dataToRender.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {dataToRender.map((item: any, index: number) => {
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
              ) : (
                <div className="text-center py-8 text-diani-sand-600">
                  <p>No results found matching your criteria.</p>
                </div>
              )}
            </div>
          );
        case 'map':
          // Handle the case where data might be an object with highlights array
          let locationsForMap: any[] = [];
          
          if (Array.isArray(message.richContent.data)) {
            // If data is already an array of locations, use it directly
            locationsForMap = message.richContent.data;
          } else if (message.richContent.data && Array.isArray(message.richContent.data.highlights)) {
            // If data is an object with highlights array, convert to Location objects
            const baseLocation = message.richContent.data.location || "Diani Beach, Kenya";
            const baseLat = -4.3167; // Diani Beach coordinates
            const baseLng = 39.5667;
            
            locationsForMap = message.richContent.data.highlights.map((highlight: string, index: number) => ({
              name: highlight,
              lat: baseLat + (index * 0.01), // Small offset for each location
              lng: baseLng + (index * 0.01),
              type: 'beach' as const
            }));
          }
          
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
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
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
              <TransportCard 
                transport={message.richContent.data} 
                onCall={(transport) => window.open(`tel:${transport.driverPhone}`)}
                onBook={(transport) => console.log('Booking transport:', transport)}
              />
            </div>
          );
        case 'transports':
          // Ensure transports data is an array
          const transports = Array.isArray(message.richContent.data) ? message.richContent.data as Transport[] : [];
          const userLocation = (message.richContent as any).userLocation;
          return (
            <div className="space-y-4">
              <p className="text-diani-sand-800 mb-4">{message.text}</p>
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
          ? "max-w-[75%] glass-dark text-diani-sand-900 rounded-br-md shadow-lg hover:scale-[1.02]"
          : message.richContent 
            ? "max-w-[90%]" 
            : "max-w-[75%] glass bg-gradient-to-br from-white/90 to-white/70 text-diani-sand-800 rounded-bl-md shadow-lg border border-white/50 hover:scale-[1.02]"
      )}>
        {renderContent()}
        <div className={cn(
          "text-xs mt-3 font-inter flex items-center gap-2",
          message.isUser ? "text-diani-sand-600" : "text-diani-sand-600"
        )}>
          <span>{formatTime(message.timestamp)}</span>
          {!message.isUser && (
            <span className="text-diani-teal-600">• Diani AI</span>
          )}
        </div>
        
        {/* Add feedback for AI messages */}
        {!message.isUser && userId && (
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