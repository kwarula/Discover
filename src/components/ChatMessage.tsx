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
import { ServiceCard } from './cards/ServiceCard';
import { ShopCard } from './cards/ShopCard';
import { RealEstateCard } from './cards/RealEstateCard';
import { TourCard } from './cards/TourCard';
import { MapView } from './MapView';
import { TransportMap } from './TransportMap';
import { ListingCard } from './cards/ListingCard';
import { Transport } from '@/types/transport';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
  userId?: string;
}

// Base listing interface matching the schema
interface ListingBase {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'activity' | 'transport' | 'service' | 'shop' | 'real_estate' | 'tour';
  description: string;
  categories: string[];
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  phone: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  price_level: 'low' | 'medium' | 'high' | 'premium' | 'variable' | 'free';
  languages_spoken: string[];
  available: boolean;
  featured: boolean;
  last_updated: string;
}

// Enhanced interface for webhook structured responses
interface WebhookResponse {
  text: string;
  isUser: boolean;
  timestamp: string;
  richContent?: {
    type: 'suggestion' | 'listing' | 'listings' | 'map' | 'mixed_results';
    data: any;
    metadata?: {
      total_count?: number;
      filters_applied?: string[];
      search_query?: string;
      location_context?: string;
    };
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

// Search results header component
const SearchResultsHeader: React.FC<{
  metadata?: WebhookResponse['richContent']['metadata'];
  resultsCount: number;
  filteredCount: number;
}> = ({ metadata, resultsCount, filteredCount }) => (
  <div className="mb-4 p-3 bg-gradient-to-r from-diani-blue-50 to-diani-teal-50 rounded-lg border border-diani-blue-200">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-semibold text-diani-blue-800">
          Search Results {metadata?.search_query && `for "${metadata.search_query}"`}
        </h4>
        <p className="text-xs text-diani-blue-600 mt-1">
          {filteredCount !== resultsCount 
            ? `Showing ${filteredCount} of ${resultsCount} results`
            : `${resultsCount} result${resultsCount !== 1 ? 's' : ''} found`
          }
          {metadata?.location_context && ` in ${metadata.location_context}`}
        </p>
      </div>
      {metadata?.filters_applied && metadata.filters_applied.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {metadata.filters_applied.map((filter, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-diani-teal-100 text-diani-teal-700 rounded-full">
              {filter}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest, userId }) => {
  // Custom components for ReactMarkdown
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

  const [filteredData, setFilteredData] = React.useState<ListingBase[]>([]);
  const [originalData, setOriginalData] = React.useState<ListingBase[]>([]);

  // Enhanced helper function to parse webhook response
  const parseWebhookResponse = (message: ChatMessageType): WebhookResponse | null => {
    try {
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

  // Helper function to validate listing structure
  const validateListing = (item: any): item is ListingBase => {
    return item && 
           typeof item.id === 'string' &&
           typeof item.name === 'string' &&
           typeof item.type === 'string' &&
           ['hotel', 'restaurant', 'activity', 'transport', 'service', 'shop', 'real_estate', 'tour'].includes(item.type);
  };

  // Helper function to normalize legacy data to new listing format
  const normalizeLegacyData = (item: any, type: string): ListingBase | null => {
    try {
      // Create base structure with defaults
      const normalized: ListingBase = {
        id: item.id || item.name?.replace(/\s+/g, '-').toLowerCase() || `${type}-${Date.now()}`,
        name: item.name || 'Unknown Name',
        type: type as ListingBase['type'],
        description: item.description || item.summary || item.highlights?.join('. ') || '',
        categories: item.categories || item.cuisine_types || item.product_types || [],
        location: {
          address: item.location || item.address || 'Diani Beach, Kenya',
          coordinates: {
            lat: item.coordinates?.lat || item.lat || -4.3167,
            lng: item.coordinates?.lng || item.lng || 39.5667
          }
        },
        images: item.images || [item.image] || [],
        phone: item.phone || item.contact || item.driverPhone || '',
        whatsapp: item.whatsapp,
        website: item.website,
        email: item.email,
        price_level: normalizePriceLevel(item.priceLevel || item.price_level || item.priceRange),
        languages_spoken: item.languages_spoken || ['English'],
        available: item.available !== false,
        featured: item.featured || false,
        last_updated: new Date().toISOString()
      };

      return normalized;
    } catch (error) {
      console.warn('Failed to normalize legacy data:', error);
      return null;
    }
  };

  // Helper function to normalize price level
  const normalizePriceLevel = (priceData: any): ListingBase['price_level'] => {
    if (typeof priceData === 'string' && ['low', 'medium', 'high', 'premium', 'variable', 'free'].includes(priceData)) {
      return priceData as ListingBase['price_level'];
    }
    
    if (typeof priceData === 'number') {
      if (priceData === 1) return 'low';
      if (priceData === 2) return 'medium';
      if (priceData === 3) return 'high';
      if (priceData === 4) return 'premium';
    }
    
    if (typeof priceData === 'string') {
      const lowerPrice = priceData.toLowerCase();
      if (lowerPrice.includes('free') || lowerPrice.includes('0')) return 'free';
      if (lowerPrice.includes('budget') || lowerPrice.includes('cheap')) return 'low';
      if (lowerPrice.includes('luxury') || lowerPrice.includes('expensive')) return 'premium';
      if (lowerPrice.includes('moderate')) return 'medium';
    }
    
    return 'medium'; // Default fallback
  };

  // Initialize data when message changes
  React.useEffect(() => {
    const webhookResponse = parseWebhookResponse(message);
    const richContent = webhookResponse?.richContent || message.richContent;
    
    if (richContent?.data) {
      let processedData: ListingBase[] = [];
      
      if (Array.isArray(richContent.data)) {
        processedData = richContent.data
          .map(item => validateListing(item) ? item : normalizeLegacyData(item, richContent.type || 'listing'))
          .filter((item): item is ListingBase => item !== null);
      } else if (typeof richContent.data === 'object') {
        // Handle single listing or wrapped data
        if (richContent.data.recommendations) {
          processedData = richContent.data.recommendations
            .map((item: any) => validateListing(item) ? item : normalizeLegacyData(item, richContent.type || 'listing'))
            .filter((item: ListingBase | null): item is ListingBase => item !== null);
        } else {
          const normalized = validateListing(richContent.data) ? richContent.data : normalizeLegacyData(richContent.data, richContent.type || 'listing');
          if (normalized) processedData = [normalized];
        }
      }
      
      setOriginalData(processedData);
      setFilteredData(processedData);
    }
  }, [message]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatWebhookTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatTime(date);
    } catch {
      return formatTime(new Date());
    }
  };

  // Enhanced filter handling for new listing structure
  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...originalData];

    // Apply price level filter
    if (filters.priceRange) {
      filtered = filtered.filter(item => {
        const priceLevel = item.price_level;
        const levelMap = { 'free': 0, 'low': 1, 'medium': 2, 'high': 3, 'premium': 4, 'variable': 2 };
        const itemLevel = levelMap[priceLevel] || 2;
        return itemLevel >= filters.priceRange!.min && itemLevel <= filters.priceRange!.max;
      });
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(item => 
        filters.categories!.some(category => 
          item.categories.some(itemCategory => 
            itemCategory.toLowerCase().includes(category.toLowerCase())
          )
        )
      );
    }

    // Apply availability filter
    if (filters.availability) {
      filtered = filtered.filter(item => item.available);
    }

    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter(item => item.featured);
    }

    setFilteredData(filtered);
  };

  const handleSortChange = (sort: SortOptions) => {
    const sorted = [...filteredData].sort((a, b) => {
      let aValue, bValue;

      switch (sort.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        case 'price':
          const levelMap = { 'free': 0, 'low': 1, 'medium': 2, 'high': 3, 'premium': 4, 'variable': 2 };
          aValue = levelMap[a.price_level] || 2;
          bValue = levelMap[b.price_level] || 2;
          break;
        case 'featured':
          aValue = a.featured ? 1 : 0;
          bValue = b.featured ? 1 : 0;
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

  // Enhanced card rendering function
  const renderListingCard = (listing: ListingBase, index: number) => {
    const key = `${listing.type}-${listing.id}-${index}`;
    
    switch (listing.type) {
      case 'hotel':
        return <HotelCard key={key} {...listing} />;
      case 'restaurant':
        return <RestaurantCard key={key} {...listing} />;
      case 'activity':
        return <ActivityCard key={key} {...listing} />;
      case 'transport':
        return <TransportCard key={key} transport={listing as any} onCall={() => {}} onBook={() => {}} />;
      case 'service':
        return <ServiceCard key={key} {...listing} />;
      case 'shop':
        return <ShopCard key={key} {...listing} />;
      case 'real_estate':
        return <RealEstateCard key={key} {...listing} />;
      case 'tour':
        return <TourCard key={key} {...listing} />;
      default:
        return <ListingCard key={key} listing={listing} />;
    }
  };

  // Enhanced content rendering with webhook support
  const renderContent = () => {
    const webhookResponse = parseWebhookResponse(message);
    const richContent = webhookResponse?.richContent || message.richContent;
    const textContent = webhookResponse?.text || message.text;

    // Handle suggestion type
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
          
          {suggestionData?.suggestions && Array.isArray(suggestionData.suggestions) && (
            <SuggestionCard suggestions={suggestionData.suggestions} />
          )}
          
          {suggestionData?.quickActions && Array.isArray(suggestionData.quickActions) && (
            <QuickActions actions={suggestionData.quickActions} />
          )}
          
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
          
          {suggestionData?.weather && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <h4 className="text-sm font-semibold text-orange-800 mb-1">🌤️ Current Weather</h4>
              <p className="text-sm text-orange-700">{suggestionData.weather}</p>
            </div>
          )}
        </div>
      );
    }

    // Handle single listing
    if (richContent?.type === 'listing' && originalData.length === 1) {
      return (
        <div className="space-y-4">
          <ReactMarkdown 
            className="prose prose-sm max-w-none prose-headings:text-diani-sand-900 prose-p:text-diani-sand-800 prose-strong:text-diani-sand-900"
            components={markdownComponents}
          >
            {textContent}
          </ReactMarkdown>
          {renderListingCard(originalData[0], 0)}
        </div>
      );
    }

    // Handle multiple listings
    if ((richContent?.type === 'listings' || richContent?.type === 'mixed_results') && originalData.length > 0) {
      const dataToRender = filteredData.length > 0 ? filteredData : originalData;
      const shouldShowFilters = originalData.length > 2;
      
      return (
        <div className="space-y-4">
          <ReactMarkdown 
            className="prose prose-sm max-w-none prose-headings:text-diani-sand-900 prose-p:text-diani-sand-800 prose-strong:text-diani-sand-900"
            components={markdownComponents}
          >
            {textContent}
          </ReactMarkdown>
          
          <SearchResultsHeader
            metadata={richContent.metadata}
            resultsCount={originalData.length}
            filteredCount={filteredData.length}
          />
          
          {shouldShowFilters && (
            <ContentFilter
              contentType="listings"
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              className="mb-4"
            />
          )}
          
          {dataToRender.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {dataToRender.map((listing, index) => renderListingCard(listing, index))}
            </div>
          ) : (
            <div className="text-center py-8 text-diani-sand-600">
              <p>No results found matching your criteria.</p>
              <button 
                onClick={() => setFilteredData(originalData)}
                className="mt-2 text-sm text-diani-teal-600 hover:text-diani-teal-700 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      );
    }

    // Handle map display
    if (richContent?.type === 'map') {
      let locationsForMap: any[] = [];
      
      if (Array.isArray(richContent.data)) {
        locationsForMap = richContent.data.map(item => ({
          name: item.name,
          lat: item.location?.coordinates?.lat || item.lat,
          lng: item.location?.coordinates?.lng || item.lng,
          type: item.type || 'listing'
        }));
      } else if (originalData.length > 0) {
        locationsForMap = originalData.map(item => ({
          name: item.name,
          lat: item.location.coordinates.lat,
          lng: item.location.coordinates.lng,
          type: item.type
        }));
      }
      
      return (
        <div className="space-y-4">
          <ReactMarkdown 
            className="prose prose-sm max-w-none prose-headings:text-diani-sand-900 prose-p:text-diani-sand-800 prose-strong:text-diani-sand-900"
            components={markdownComponents}
          >
            {textContent}
          </ReactMarkdown>
          {locationsForMap.length > 0 ? (
            <MapView locations={locationsForMap} />
          ) : (
            <div className="text-center py-8 text-diani-sand-600">
              <p>No map data available.</p>
            </div>
          )}
        </div>
      );
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
  const hasRichContent = !!(webhookResponse?.richContent || message.richContent);

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
          : hasRichContent
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