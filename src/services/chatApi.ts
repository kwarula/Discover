import { offlineService } from './offlineService';

// ✅ Define required environment variables
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!CHAT_API_URL) {
  throw new Error('VITE_CHAT_API_URL is not defined in environment variables.');
}

// TYPES (same as before)
export interface ChatApiRequest {
  message: string;
  userId: string;
  userProfile?: {
    username?: string;
    travelStyle?: 'adventure' | 'relaxation' | 'cultural' | 'family' | 'budget' | 'luxury';
    interests?: string[];
    preferredLanguage?: string;
  };
  userLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  context?: {
    previousMessages?: ChatMessage[];
    currentTime?: string;
    sessionId?: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  richContent?: RichContent;
}

export interface RichContent {
  type: 'suggestion' | 'listing' | 'info' | 'map';
  data: SuggestionData | ListingData | InfoData | MapData;
}

export interface SuggestionData {
  suggestions: string[];
  highlights?: string[];
}

export interface ListingData {
  category: 'transport' | 'accommodation' | 'dining' | 'activities';
  title: string;
  items: ListingItem[];
}

export interface InfoData {
  category: 'weather' | 'general' | 'location';
  title: string;
  details: Record<string, string>;
}

export interface MapData {
  center: {
    lat: number;
    lng: number;
  };
  markers: MapMarker[];
}

export interface ListingItem {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel' | 'transport' | 'activity' | 'accommodation';
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact?: string;
  priceRange?: string;
  cuisine?: string;
  features?: string[];
  rating?: number;
  images?: string[];
}

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  description: string;
  type: 'restaurant' | 'hotel' | 'transport' | 'activity' | 'accommodation';
}

export interface ChatApiResponse {
  text: string;
  richContent?: RichContent;
  isUser: false;
  timestamp: string;
  metadata?: {
    userId?: string;
    sessionId?: string;
    originalQuery?: string;
  };
  offline?: boolean;
  error?: boolean;
}

// TYPE GUARD
function isValidChatApiResponse(data: any): data is ChatApiResponse {
  return (
    data && 
    typeof data === 'object' &&
    typeof data.text === 'string' && 
    typeof data.timestamp === 'string' && 
    data.isUser === false
  );
}

// DEFAULT FALLBACK CONTENT
const getDefaultSuggestions = (): RichContent => ({
  type: 'suggestion',
  data: {
    suggestions: [
      "Tell me about Diani Beach",
      "Show me the best restaurants",
      "Find beach activities",
      "Recommend hotels",
      "Transport options"
    ],
    highlights: [
      "25km of pristine beaches",
      "World-class kitesurfing",
      "Rich Swahili culture",
      "Tropical climate year-round"
    ]
  }
});

// MAIN FUNCTION
export const sendChatMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  // Input validation
  if (!request.message || !request.userId) {
    return {
      text: "Please provide a message to get started.",
      richContent: getDefaultSuggestions(),
      isUser: false,
      timestamp: new Date().toISOString(),
      error: true
    };
  }

  // Offline fallback
  if (!offlineService.getOnlineStatus()) {
    // Store message for later sync
    try {
      await offlineService.storeForSync('chat-messages', {
        request,
        timestamp: new Date().toISOString(),
        status: 'offline'
      });
    } catch (syncError) {
      console.warn('Failed to store message for offline sync:', syncError);
    }

    return {
      text: "I'm currently offline, but I can still help with general information about Diani Beach.",
      richContent: {
        type: "suggestion",
        data: {
          suggestions: [
            "Tell me about Diani Beach",
            "What activities are available?",
            "Best time to visit",
            "General information"
          ],
          highlights: [
            "25km of pristine beaches",
            "World-class kitesurfing",
            "Rich Swahili culture",
            "Tropical climate year-round"
          ]
        }
      },
      isUser: false,
      timestamp: new Date().toISOString(),
      offline: true
    };
  }

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type') || '';
    let responseData: any;

    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const raw = await response.text();
      try {
        responseData = JSON.parse(raw);
      } catch {
        responseData = {
          text: raw || "I received your message but couldn't generate a proper response.",
          timestamp: new Date().toISOString(),
          isUser: false
        };
      }
    }

    // Validate response format
    if (!isValidChatApiResponse(responseData)) {
      console.warn('Invalid response format:', responseData);
      throw new Error('Invalid response format from chat API.');
    }

    // Add default rich content if missing
    if (!responseData.richContent) {
      responseData.richContent = getDefaultSuggestions();
    }

    return responseData;

  } catch (error) {
    console.error('Chat API error:', error);

    // Store failed request for sync when online
    try {
      await offlineService.storeForSync('chat-messages', {
        request,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        status: 'failed'
      });
    } catch (syncError) {
      console.warn('Failed to store message for sync:', syncError);
    }

    // Determine error message based on error type
    let errorMessage = "I'm having trouble connecting to my knowledge base right now. Please try again shortly.";
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = "Connection failed. Please check your internet connection and try again.";
    } else if (error instanceof Error && error.message.includes('timeout')) {
      errorMessage = "Request timed out. Please try again.";
    } else if (error instanceof Error && error.message.includes('HTTP 429')) {
      errorMessage = "Too many requests. Please wait a moment and try again.";
    }

    return {
      text: errorMessage,
      richContent: {
        type: "suggestion",
        data: {
          suggestions: [
            "Try again",
            "Tell me about Diani Beach",
            "What can I do here?",
            "Best restaurants nearby"
          ],
          highlights: [
            "25km of pristine beaches",
            "Crystal-clear waters",
            "Amazing coral reefs",
            "Perfect for water sports"
          ]
        }
      },
      isUser: false,
      timestamp: new Date().toISOString(),
      error: true
    };
  }
};

// Additional utility functions for offline support
export const getCachedMessages = (): ChatMessage[] => {
  try {
    const cached = offlineService.getOfflineData('chat-messages');
    return cached && Array.isArray(cached) ? cached : [];
  } catch (error) {
    console.error('Failed to get cached messages:', error);
    return [];
  }
};

export const clearCachedMessages = (): void => {
  try {
    offlineService.clearOfflineData('chat-messages');
  } catch (error) {
    console.error('Failed to clear cached messages:', error);
  }
};

export const getSyncStatus = () => {
  return offlineService.getSyncQueueStatus();
};

export const retryFailedSync = () => {
  offlineService.retryFailedSync();
};