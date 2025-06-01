import { Suggestion, UserProfile, ChatMessage } from '@/types';
import { WeatherData } from '@/services/weatherApi';
import { format } from 'date-fns';

interface GenerateSuggestionsParams {
  userProfile: UserProfile | null;
  weatherData: WeatherData | null;
  chatMessages: ChatMessage[];
  currentTime?: Date;
}

export const generateProactiveSuggestions = ({
  userProfile,
  weatherData,
  chatMessages,
  currentTime = new Date()
}: GenerateSuggestionsParams): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const hour = currentTime.getHours();
  const formattedTime = format(currentTime, 'h:mm a');

  // Time-based suggestions
  if (hour >= 6 && hour < 10) {
    suggestions.push({
      id: 'breakfast',
      text: 'Looking for breakfast? I know some great spots!',
      query: 'What are the best breakfast places in Diani?',
      icon: 'Coffee',
      priority: 'medium',
      category: 'time',
      context: { time: formattedTime }
    });
  } else if (hour >= 11 && hour < 14) {
    suggestions.push({
      id: 'lunch',
      text: 'Time for lunch! Want some recommendations?',
      query: 'Where can I have lunch now?',
      icon: 'Utensils',
      priority: 'medium',
      category: 'time',
      context: { time: formattedTime }
    });
  } else if (hour >= 16 && hour < 18) {
    suggestions.push({
      id: 'sunset',
      text: 'Sunset is approaching! Want to catch the best views?',
      query: 'What are the best sunset viewing spots in Diani?',
      icon: 'Sunset',
      priority: 'high',
      category: 'time',
      context: { time: formattedTime }
    });
  } else if (hour >= 18 && hour < 22) {
    suggestions.push({
      id: 'dinner',
      text: 'Ready for dinner? I have some perfect spots in mind!',
      query: 'What are the best dinner restaurants open now?',
      icon: 'UtensilsCrossed',
      priority: 'medium',
      category: 'time',
      context: { time: formattedTime }
    });
  }

  // Weather-based suggestions
  if (weatherData) {
    if (weatherData.condition === 'Sunny' && weatherData.temperature > 28) {
      suggestions.push({
        id: 'beach-weather',
        text: `Perfect beach weather! ${weatherData.temperature}°C and sunny.`,
        query: 'What beach activities are available now?',
        icon: 'Umbrella',
        priority: 'high',
        category: 'weather',
        context: { weather: `${weatherData.temperature}°C, ${weatherData.condition}` }
      });
    } else if (weatherData.condition.includes('Rain')) {
      suggestions.push({
        id: 'indoor-activities',
        text: 'Rain expected. How about some indoor activities?',
        query: 'What indoor activities are available in Diani?',
        icon: 'Cloud',
        priority: 'high',
        category: 'weather',
        context: { weather: weatherData.condition }
      });
    }

    if (weatherData.uvIndex > 7) {
      suggestions.push({
        id: 'uv-warning',
        text: 'High UV index! Want to know about shaded activities?',
        query: 'What shaded or indoor activities are recommended?',
        icon: 'Sun',
        priority: 'high',
        category: 'weather',
        context: { weather: `UV Index: ${weatherData.uvIndex}` }
      });
    }
  }

  // User preference based suggestions
  if (userProfile) {
    if (userProfile.travelStyle === 'adventure') {
      suggestions.push({
        id: 'adventure',
        text: 'Ready for your next adventure?',
        query: 'What adventure activities are available today?',
        icon: 'Compass',
        priority: 'medium',
        category: 'preference'
      });
    } else if (userProfile.travelStyle === 'relaxed') {
      suggestions.push({
        id: 'relaxation',
        text: 'Looking for some relaxation?',
        query: 'What are the best spa and wellness options?',
        icon: 'Sparkles',
        priority: 'medium',
        category: 'preference'
      });
    }

    // Interest-based suggestions
    if (userProfile.interests.includes('Diving')) {
      suggestions.push({
        id: 'diving',
        text: 'Perfect conditions for diving today!',
        query: 'What are the best diving spots currently accessible?',
        icon: 'Waves',
        priority: 'medium',
        category: 'preference'
      });
    }
  }

  // Memory-based suggestions (based on chat history)
  const recentMessages = chatMessages.slice(-5);
  const hasRecentRestaurantQuery = recentMessages.some(msg => 
    msg.text.toLowerCase().includes('restaurant') || 
    msg.text.toLowerCase().includes('food') ||
    msg.text.toLowerCase().includes('eat')
  );

  if (!hasRecentRestaurantQuery) {
    suggestions.push({
      id: 'restaurants',
      text: 'Hungry? Discover local cuisine!',
      query: 'What are the must-try local restaurants?',
      icon: 'Utensils',
      priority: 'low',
      category: 'memory'
    });
  }

  // Sort suggestions by priority and limit to top 3
  const priorityValues = { high: 3, medium: 2, low: 1 };
  return suggestions
    .sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority])
    .slice(0, 3);
};