export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date; // Keep as Date, conversion from string happens in UI layer
  richContent?: {
    type: 'hotel' | 'restaurant' | 'activity' | 'hotels' | 'restaurants' | 'activities' | 'map' | 'transport' | 'transports' | 'listing' | 'suggestion'; // Added 'listing' and ensured 'suggestion' is there
    data: any | ListingRichContentData; // Accommodate ListingRichContentData
  };
}

export interface UserProfile {
  username: string;
  travelStyle: 'adventure' | 'relaxed' | 'family' | 'luxury' | 'budget';
  interests: string[];
  preferredLanguage: string;
}

export interface ListingRichContentData {
  name: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  phone?: string;
  price_level?: string;
  languages_spoken?: string[];
  available?: boolean;
  featured?: boolean;
}

export interface ChatApiResponse {
  text: string;
  isUser?: boolean; // Added
  timestamp?: string; // Added - assuming string from JSON, will be Date in ChatMessage
  offline?: boolean;
  richContent?: {
    type: 'hotel' | 'restaurant' | 'activity' | 'hotels' | 'restaurants' | 'activities' | 'map' | 'transport' | 'transports' | 'listing'; // Added 'listing'
    data: any | ListingRichContentData; // Updated to include ListingRichContentData
  };
}

export interface ChatApiRequest {
  message: string;
  userId: string;
  userProfile?: UserProfile;
  userLocation?: { lat: number; lng: number };
  context?: {
    previousMessages?: ChatMessage[];
    currentTime?: string;
    sessionId?: string;
  };
}

export interface Suggestion {
  id: string;
  text: string;
  query: string;
  icon: keyof typeof import('lucide-react');
  priority: 'low' | 'medium' | 'high';
  category: 'time' | 'weather' | 'preference' | 'memory';
  context?: {
    time?: string;
    weather?: string;
    previousQuery?: string;
  };
}

// User feedback types
export interface MessageFeedback {
  messageId: string;
  userId: string;
  feedbackType: 'helpful' | 'not_helpful' | 'inappropriate' | 'inaccurate';
  rating?: number; // 1-5 scale
  comment?: string;
  timestamp: Date;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
}

// Enhanced filtering types
export interface FilterOptions {
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: {
    min: number;
  };
  amenities?: string[];
  cuisine?: string[];
  difficulty?: string[];
  location?: string;
  availability?: 'now' | 'today' | 'this_week';
}

export interface SortOptions {
  field: 'rating' | 'price' | 'distance' | 'popularity';
  direction: 'asc' | 'desc';
}

// Location interface for map and listing data
export interface Location {
  name: string;
  lat: number;
  lng: number;
  type: 'hotel' | 'restaurant' | 'beach' | 'activity';
}

// Base interface for all listing types
export interface ListingBase {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'activity' | 'transport';
  location: string;
  image?: string;
  rating?: number;
  price?: string;
  priceValue?: number;
  currency?: string;
  
  // Hotel specific
  amenities?: string[];
  description?: string;
  pricePerNight?: number;
  
  // Restaurant specific
  cuisine?: string;
  priceLevel?: 1 | 2 | 3 | 4;
  hours?: string;
  phone?: string;
  specialties?: string[];
  
  // Activity specific
  category?: string;
  duration?: string;
  groupSize?: string;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  highlights?: string[];
  availability?: string;
  
  // Transport specific (for Transport type from transport.ts)
  transport?: any; // Will use the Transport interface when needed
}