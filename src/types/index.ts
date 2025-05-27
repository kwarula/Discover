
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UserProfile {
  username: string;
  travelStyle: 'adventure' | 'relaxed' | 'family' | 'luxury' | 'budget';
  interests: string[];
  preferredLanguage: string;
}

export interface ChatApiResponse {
  text: string;
}

export interface ChatApiRequest {
  message: string;
  userId: string;
  userProfile?: UserProfile;
}
