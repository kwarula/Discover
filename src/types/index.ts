export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  richContent?: {
    type: 'hotel' | 'restaurant' | 'activity' | 'hotels' | 'restaurants' | 'activities' | 'map' | 'transport' | 'transports';
    data: any;
  };
}

export interface UserProfile {
  username: string;
  travelStyle: 'adventure' | 'relaxed' | 'family' | 'luxury' | 'budget';
  interests: string[];
  preferredLanguage: string;
}

export interface ChatApiResponse {
  text: string;
  richContent?: {
    type: 'hotel' | 'restaurant' | 'activity' | 'hotels' | 'restaurants' | 'activities' | 'map' | 'transport' | 'transports';
    data: any;
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