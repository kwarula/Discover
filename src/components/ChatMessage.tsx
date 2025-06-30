import React, { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { ChatMessage as ChatMessageType, Location, ListingBase } from '@/types';
import { cn } from '@/lib/utils';
import { MessageFeedback } from './MessageFeedback';
import { ContentFilter } from './ContentFilter';
import { FilterOptions, SortOptions } from '@/types';
import { MapView } from './MapView';
import { ListingCard } from './cards/ListingCard';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

// WebhookResponse interface is removed as parsing happens upstream.

interface SuggestionData {
  readonly suggestions?: readonly string[];
  readonly quickActions?: readonly Array<{ label: string; action: string }>;
  readonly highlights?: readonly string[];
  readonly weather?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PRICE_LEVEL_MAP = {
  free: 0,
  low: 1,
  medium: 2,
  high: 3,
  premium: 4,
  variable: 2,
} as const;

const VALID_LISTING_TYPES = new Set([
  'hotel', 'restaurant', 'activity', 'transport', 
  'service', 'shop', 'real_estate', 'tour'
] as const);

const MARKDOWN_COMPONENTS: Components = {
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
  ),
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const isValidListingType = (type: string): type is ListingBase['type'] => {
  return VALID_LISTING_TYPES.has(type as ListingBase['type']);
};

const normalizePriceLevel = (priceData: unknown): ListingBase['price_level'] => {
  if (typeof priceData === 'string' && priceData in PRICE_LEVEL_MAP) {
    return priceData as ListingBase['price_level'];
  }
  
  if (typeof priceData === 'number') {
    const levels: ListingBase['price_level'][] = ['free', 'low', 'medium', 'high', 'premium'];
    return levels[Math.min(priceData, 4)] || 'medium';
  }
  
  if (typeof priceData === 'string') {
    const lowerPrice = priceData.toLowerCase();
    if (lowerPrice.includes('free') || lowerPrice.includes('0')) return 'free';
    if (lowerPrice.includes('budget') || lowerPrice.includes('cheap')) return 'low';
    if (lowerPrice.includes('luxury') || lowerPrice.includes('expensive')) return 'premium';
    if (lowerPrice.includes('moderate')) return 'medium';
  }
  
  return 'medium';
};

const validateListing = (item: unknown): item is ListingBase => {
  if (!item || typeof item !== 'object') return false;
  
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.type === 'string' &&
    isValidListingType(obj.type)
  );
};

const createSafeId = (name: string, type: string): string => {
  const sanitized = name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
  return `${type}-${sanitized}-${Date.now()}`;
};

const normalizeLegacyData = (item: unknown, type: string): ListingBase | null => {
  if (!item || typeof item !== 'object') return null;
  
  try {
    const obj = item as Record<string, any>; // obj is potentially ListingRichContentData

    let address = 'Diani Beach, Kenya';
    let coordinates = { lat: -4.3167, lng: 39.5667 };

    if (type === 'listing' && obj.location && typeof obj.location === 'object') {
      // Handle ListingRichContentData structure for location
      address = obj.location.address || address;
      if (obj.location.coordinates) {
        coordinates.lat = obj.location.coordinates.lat ?? coordinates.lat;
        coordinates.lng = obj.location.coordinates.lng ?? coordinates.lng;
      }
    } else {
      // Fallback for other types or if location is a string (legacy)
      address = obj.location || obj.address || address;
      if (obj.coordinates) {
        coordinates.lat = obj.coordinates.lat ?? coordinates.lat;
        coordinates.lng = obj.coordinates.lng ?? coordinates.lng;
      } else if (obj.lat && obj.lng) {
        coordinates.lat = obj.lat ?? coordinates.lat;
        coordinates.lng = obj.lng ?? coordinates.lng;
      }
    }
    
    const normalized: ListingBase = {
      id: obj.id || createSafeId(obj.name || 'unknown', type),
      name: obj.name || 'Unknown Name',
      type: isValidListingType(type) ? type : 'service', // type here will be 'listing'
      description: obj.description || obj.summary || (Array.isArray(obj.highlights) ? obj.highlights.join('. ') : ''),
      categories: Array.isArray(obj.categories) ? obj.categories : 
                 Array.isArray(obj.cuisine_types) ? obj.cuisine_types :
                 Array.isArray(obj.product_types) ? obj.product_types : [],
      location: { // This is for ListingBase.location which expects address and coordinates
        address: address,
        coordinates: coordinates
      },
      images: Array.isArray(obj.images) ? obj.images : 
              obj.image ? [obj.image] : [],
      phone: obj.phone || obj.contact || obj.driverPhone || '',
      whatsapp: obj.whatsapp,
      website: obj.website,
      email: obj.email,
      price_level: normalizePriceLevel(obj.price_level || obj.priceLevel || obj.priceRange), // obj.price_level for ListingRichContentData
      languages_spoken: Array.isArray(obj.languages_spoken) ? obj.languages_spoken : (obj.languages_spoken ? [obj.languages_spoken] : ['English']), // obj.languages_spoken for ListingRichContentData
      available: obj.available !== undefined ? Boolean(obj.available) : true, // obj.available for ListingRichContentData
      featured: Boolean(obj.featured), // obj.featured for ListingRichContentData
      last_updated: new Date().toISOString()
    };

    return normalized;
  } catch (error) {
    console.warn('Failed to normalize legacy data:', error);
    return null;
  }
};

// parseWebhookResponse function is removed.

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useListingData = (message: ChatMessageType) => {
  return useMemo(() => {
    const richContent = message.richContent; // Directly use richContent from message
    
    if (!richContent?.data) return [];
    
    let processedData: ListingBase[] = [];
    
    if (Array.isArray(richContent.data)) {
      processedData = richContent.data
        .map(item => validateListing(item) ? item : normalizeLegacyData(item, richContent.type || 'listing'))
        .filter((item): item is ListingBase => item !== null);
    } else if (typeof richContent.data === 'object' && richContent.data !== null) {
      const data = richContent.data as Record<string, any>;
      
      if (Array.isArray(data.recommendations)) {
        processedData = data.recommendations
          .map((item: any) => validateListing(item) ? item : normalizeLegacyData(item, richContent.type || 'listing'))
          .filter((item: ListingBase | null): item is ListingBase => item !== null);
      } else {
        const normalized = validateListing(data) ? data : normalizeLegacyData(data, richContent.type || 'listing');
        if (normalized) processedData = [normalized];
      }
    }
    
    return processedData;
  }, [message]);
};

const useFilteredData = (originalData: ListingBase[]) => {
  const [filteredData, setFilteredData] = useState<ListingBase[]>(originalData);
  
  useEffect(() => {
    setFilteredData(originalData);
  }, [originalData]);
  
  const handleFilterChange = useCallback((filters: FilterOptions) => {
    let filtered = [...originalData];

    if (filters.priceRange) {
      filtered = filtered.filter(item => {
        const itemLevel = PRICE_LEVEL_MAP[item.price_level] ?? 2;
        return itemLevel >= filters.priceRange!.min && itemLevel <= filters.priceRange!.max;
      });
    }

    if (filters.categories?.length) {
      filtered = filtered.filter(item => 
        filters.categories!.some(category => 
          item.categories.some(itemCategory => 
            itemCategory.toLowerCase().includes(category.toLowerCase())
          )
        )
      );
    }

    if (filters.availability) {
      filtered = filtered.filter(item => item.available);
    }

    if (filters.featured) {
      filtered = filtered.filter(item => item.featured);
    }

    setFilteredData(filtered);
  }, [originalData]);

  const handleSortChange = useCallback((sort: SortOptions) => {
    setFilteredData(current => {
      const sorted = [...current].sort((a, b) => {
        let comparison = 0;

        switch (sort.field) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'price':
            const aLevel = PRICE_LEVEL_MAP[a.price_level] ?? 2;
            const bLevel = PRICE_LEVEL_MAP[b.price_level] ?? 2;
            comparison = aLevel - bLevel;
            break;
          case 'featured':
            comparison = (a.featured ? 1 : 0) - (b.featured ? 1 : 0);
            break;
          default:
            return 0;
        }

        return sort.direction === 'asc' ? comparison : -comparison;
      });

      return sorted;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilteredData(originalData);
  }, [originalData]);

  return {
    filteredData,
    handleFilterChange,
    handleSortChange,
    clearFilters
  };
};

const useFormattedTime = (timestamp: string | Date) => {
  return useMemo(() => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
  }, [timestamp]);
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface SuggestionCardProps {
  suggestions: readonly string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

const SuggestionCard = memo<SuggestionCardProps>(({ suggestions, onSuggestionSelect }) => {
  const handleSuggestionClick = useCallback((suggestion: string) => {
    onSuggestionSelect?.(suggestion);
    
    // Fallback to custom event for backward compatibility
    const event = new CustomEvent('suggestion-selected', { 
      detail: { suggestion } 
    });
    window.dispatchEvent(event);
  }, [onSuggestionSelect]);

  return (
    <div className="bg-gradient-to-br from-diani-teal-50 to-diani-blue-50 border border-diani-teal-200 rounded-lg p-4 mt-2">
      <h4 className="text-sm font-semibold text-diani-teal-800 mb-2">💡 Suggestions</h4>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={`suggestion-${index}`}
            className="w-full flex items-start gap-2 p-2 bg-white/60 rounded-md hover:bg-white/80 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-diani-teal-500"
            onClick={() => handleSuggestionClick(suggestion)}
            type="button"
          >
            <span className="text-diani-teal-600 text-xs mt-1" aria-hidden="true">▸</span>
            <span className="text-sm text-diani-sand-800 flex-1">{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

SuggestionCard.displayName = 'SuggestionCard';

interface QuickActionsProps {
  actions: readonly Array<{ label: string; action: string }>;
  onQuickAction?: (action: string) => void;
}

const QuickActions = memo<QuickActionsProps>(({ actions, onQuickAction }) => {
  const handleActionClick = useCallback((action: string) => {
    onQuickAction?.(action);
    
    // Fallback to custom event for backward compatibility
    const event = new CustomEvent('quick-action', { 
      detail: { action } 
    });
    window.dispatchEvent(event);
  }, [onQuickAction]);

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {actions.map((action, index) => (
        <button
          key={`action-${index}`}
          onClick={() => handleActionClick(action.action)}
          className="px-3 py-1 text-xs bg-diani-teal-100 text-diani-teal-700 rounded-full hover:bg-diani-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-diani-teal-500"
          type="button"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

interface SearchResultsHeaderProps {
  metadata?: RichContentMetadata;
  resultsCount: number;
  filteredCount: number;
}

const SearchResultsHeader = memo<SearchResultsHeaderProps>(({ 
  metadata, 
  resultsCount, 
  filteredCount 
}) => (
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
      {metadata?.filters_applied?.length && (
        <div className="flex flex-wrap gap-1">
          {metadata.filters_applied.map((filter, index) => (
            <span 
              key={`filter-${index}`} 
              className="px-2 py-1 text-xs bg-diani-teal-100 text-diani-teal-700 rounded-full"
            >
              {filter}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
));

SearchResultsHeader.displayName = 'SearchResultsHeader';

interface HighlightsProps {
  highlights: readonly string[];
}

const Highlights = memo<HighlightsProps>(({ highlights }) => (
  <div className="bg-gradient-to-r from-diani-blue-50 to-diani-teal-50 border border-diani-blue-200 rounded-lg p-3 mt-2">
    <h4 className="text-sm font-semibold text-diani-blue-800 mb-2">🏖️ Local Highlights</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
      {highlights.map((highlight, index) => (
        <div key={`highlight-${index}`} className="text-xs text-diani-sand-700 flex items-center gap-1">
          <span className="text-diani-blue-500" aria-hidden="true">•</span>
          {highlight}
        </div>
      ))}
    </div>
  </div>
));

Highlights.displayName = 'Highlights';

interface WeatherInfoProps {
  weather: string;
}

const WeatherInfo = memo<WeatherInfoProps>(({ weather }) => (
  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mt-2">
    <h4 className="text-sm font-semibold text-orange-800 mb-1">🌤️ Current Weather</h4>
    <p className="text-sm text-orange-700">{weather}</p>
  </div>
));

WeatherInfo.displayName = 'WeatherInfo';

interface NoResultsProps {
  onClearFilters: () => void;
}

const NoResults = memo<NoResultsProps>(({ onClearFilters }) => (
  <div className="text-center py-8 text-diani-sand-600">
    <p className="mb-2">No results found matching your criteria.</p>
    <button 
      onClick={onClearFilters}
      className="text-sm text-diani-teal-600 hover:text-diani-teal-700 underline focus:outline-none focus:ring-2 focus:ring-diani-teal-500 rounded"
      type="button"
    >
      Clear filters
    </button>
  </div>
));

NoResults.displayName = 'NoResults';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ChatMessage = memo<ChatMessageProps>(({ 
  message, 
  isLatest = false, 
  userId,
  onSuggestionSelect,
  onQuickAction 
}) => {
  const originalData = useListingData(message);
  const { 
    filteredData, 
    handleFilterChange, 
    handleSortChange, 
    clearFilters 
  } = useFilteredData(originalData);

  // Directly use properties from the message object
  const { richContent, text: textContent, isUser: isUserMessage, timestamp } = message;
  
  const formattedTime = useFormattedTime(timestamp); // timestamp is already a Date object from ChatMessageType
  const hasRichContent = Boolean(richContent);

  // Render specialized card for each listing type
  const renderListingCard = useCallback((listing: ListingBase, index: number) => {
    const key = `${listing.type}-${listing.id}-${index}`;
    
    // Import and use specialized card components dynamically
    // This is a simplified version - in reality, you'd use dynamic imports or a factory
    return <ListingCard key={key} listing={listing} />;
  }, []);

  // Main content renderer
  const renderContent = useCallback(() => {
    // Handle suggestion type
    if (richContent?.type === 'suggestion') {
      const suggestionData = richContent.data as SuggestionData;
      
      return (
        <div className="space-y-3">
          <ReactMarkdown 
            className="prose prose-sm max-w-none prose-headings:text-diani-sand-900 prose-p:text-diani-sand-800 prose-strong:text-diani-sand-900"
            components={MARKDOWN_COMPONENTS}
          >
            {textContent}
          </ReactMarkdown>
          
          {suggestionData?.suggestions?.length && (
            <SuggestionCard 
              suggestions={suggestionData.suggestions} 
              onSuggestionSelect={onSuggestionSelect}
            />
          )}
          
          {suggestionData?.quickActions?.length && (
            <QuickActions 
              actions={suggestionData.quickActions}
              onQuickAction={onQuickAction} 
            />
          )}
          
          {suggestionData?.highlights?.length && (
            <Highlights highlights={suggestionData.highlights} />
          )}
          
          {suggestionData?.weather && (
            <WeatherInfo weather={suggestionData.weather} />
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
            components={MARKDOWN_COMPONENTS}
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
            components={MARKDOWN_COMPONENTS}
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
              {dataToRender.map(renderListingCard)}
            </div>
          ) : (
            <NoResults onClearFilters={clearFilters} />
          )}
        </div>
      );
    }

    // Handle map display
    if (richContent?.type === 'map') {
      const locationsForMap = useMemo(() => {
        if (Array.isArray(richContent.data)) {
          return richContent.data.map((item: any) => ({
            name: item.name,
            lat: item.location?.coordinates?.lat || item.lat,
            lng: item.location?.coordinates?.lng || item.lng,
            type: item.type || 'listing'
          }));
        } else if (originalData.length > 0) {
          return originalData.map(item => ({
            name: item.name,
            lat: item.location.coordinates.lat,
            lng: item.location.coordinates.lng,
            type: item.type
          }));
        }
        return [];
      }, [richContent.data, originalData]);
      
      return (
        <div className="space-y-4">
          <ReactMarkdown 
            className="prose prose-sm max-w-none prose-headings:text-diani-sand-900 prose-p:text-diani-sand-800 prose-strong:text-diani-sand-900"
            components={MARKDOWN_COMPONENTS}
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
        components={MARKDOWN_COMPONENTS}
      >
        {textContent}
      </ReactMarkdown>
    );
  }, [richContent, textContent, originalData, filteredData, onSuggestionSelect, onQuickAction, renderListingCard, handleFilterChange, handleSortChange, clearFilters]);

  return (
    <div
      className={cn(
        "flex mb-4 animate-fade-in",
        isUserMessage ? "justify-end" : "justify-start",
        isLatest && (isUserMessage ? "animate-slide-in-right" : "animate-slide-in-left")
      )}
      role="log"
      aria-live="polite"
      aria-label={`${isUserMessage ? 'User' : 'AI'} message sent at ${formattedTime}`}
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
          <time dateTime={timestamp.toString()}>{formattedTime}</time>
          {!isUserMessage && (
            <span className="text-diani-teal-600">• Diani AI</span>
          )}
        </div>
        
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
});

ChatMessage.displayName = 'ChatMessage';