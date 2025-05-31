
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
}
