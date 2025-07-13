// Updated types for your chat API
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
  type: 'suggestion' | 'listing' | 'listings' | 'info' | 'map';
  data: SuggestionData | ListingData | ListingsData | InfoData | MapData;
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

export interface ListingsData {
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

// Updated service function
export const sendChatMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  // Check if offline
  if (!offlineService.getOnlineStatus()) {
    return {
      text: "I'm currently offline, but I can still help with general information about Diani Beach! The area is famous for its pristine white sand beaches, crystal-clear waters, and vibrant coral reefs. Popular activities include dolphin watching, snorkeling, kite surfing, and exploring local restaurants. When you're back online, I'll have access to real-time recommendations and can help you book specific services.",
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
    console.log('Sending chat request via Supabase Edge Function:', {
      url: CHAT_API_URL,
      userProfile: request.userProfile ? 'included' : 'not included',
      userLocation: request.userLocation ? 'included' : 'not included',
      context: request.context ? 'included' : 'not included',
    });
    
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('Edge Function response status:', response.status);
    
    if (!response.ok) {
      console.error(`Edge Function error! status: ${response.status} ${response.statusText}`);
      
      let errorDetails = '';
      try {
        const errorText = await response.text();
        errorDetails = errorText ? ` - ${errorText}` : '';
      } catch (e) {
        console.error('Could not read error response:', e);
      }
      
      throw new Error(`Edge Function returned ${response.status}: ${response.statusText}${errorDetails}`);
    }

    // Parse the response
    let responseData: ChatApiResponse;
    const contentType = response.headers.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      // If not JSON, treat as plain text response
      const textResponse = await response.text();
      
      // Try to parse as JSON if possible
      try {
        responseData = JSON.parse(textResponse);
      } catch {
        // Create fallback response with rich content
        responseData = {
          text: textResponse || "I received your message but got an unexpected response format. Please try again.",
          richContent: {
            type: "suggestion",
            data: {
              suggestions: [
                "Show me the best restaurants",
                "Find beach activities",
                "Recommend hotels",
                "Transport options"
              ],
              highlights: [
                "25km of pristine beaches",
                "World-class kitesurfing",
                "Rich Swahili culture"
              ]
            }
          },
          isUser: false,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Ensure all responses have rich content
    if (!responseData.richContent) {
      responseData.richContent = {
        type: "suggestion",
        data: {
          suggestions: [
            "Show me the best restaurants",
            "Find beach activities", 
            "Recommend hotels",
            "Transport options"
          ],
          highlights: [
            "25km of pristine beaches",
            "World-class kitesurfing",
            "Rich Swahili culture"
          ]
        }
      };
    }

    console.log('Parsed Edge Function response:', responseData);
    return responseData;

  } catch (error) {
    console.error('Chat API error (via Edge Function):', error);
    
    // Store for offline sync if possible
    try {
      await offlineService.storeForSync('chat-messages', {
        request,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (syncError) {
      console.error('Failed to store message for offline sync:', syncError);
    }
    
    // Return a graceful fallback response with rich content
    return {
      text: "I'm having trouble connecting to my knowledge base right now. This might be a temporary network issue. Meanwhile, I'd be happy to share some general information about Diani Beach! It's renowned for its pristine white sand beaches, crystal-clear waters, and amazing coral reefs perfect for snorkeling and diving. Please try your question again in a moment.",
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