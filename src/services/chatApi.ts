import { ChatApiRequest, ChatApiResponse } from '@/types';
import { offlineService } from '@/services/offlineService';

const API_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-proxy`;

export const sendChatMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  // Check if offline
  if (!offlineService.getOnlineStatus()) {
    return {
      text: "I'm currently offline, but I can still help with general information about Diani Beach! The area is famous for its pristine white sand beaches, crystal-clear waters, and vibrant coral reefs. Popular activities include dolphin watching, snorkeling, kite surfing, and exploring local restaurants. When you're back online, I'll have access to real-time recommendations and can help you book specific services.",
      offline: true
    };
  }

  try {
    console.log('Sending enhanced chat request:', {
      ...request,
      // Log request structure without sensitive data
      userProfile: request.userProfile ? 'included' : 'not included',
      userLocation: request.userLocation ? 'included' : 'not included',
      context: request.context ? 'included' : 'not included'
    });
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(request),
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);

    if (response.status === 401) {
      console.error('Authentication failed - 401 Unauthorized');
      return {
        text: "I'm having trouble connecting to my knowledge base right now. This might be a temporary authentication issue. Meanwhile, I'd be happy to share some general information about Diani Beach! It's renowned for its pristine white sand beaches, crystal-clear waters, and amazing coral reefs perfect for snorkeling and diving."
      };
    }

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clone the response to allow reading the body multiple times if needed
    const clonedResponse = response.clone();

    try {
      const responseData = await response.json();
      console.log('Parsed response data:', responseData);
      return responseData as ChatApiResponse;
    } catch (e) {
      // If JSON parsing fails, read as text from the cloned response and log the error.
      console.error('Failed to parse API response as JSON. Attempting to read as text.', e);
      try {
        const responseText = await clonedResponse.text();
        console.error('Raw response text after JSON parse failure:', responseText);
        return {
          text: `Error: Received non-JSON response from server. Content: ${responseText.substring(0, 200)}...`,
          // Ensure this object matches ChatApiResponse structure, e.g., by adding other required fields if any.
        };
      } catch (textError) {
        console.error('Failed to read response as text after JSON parse failure:', textError);
        return {
          text: "Error: Received non-JSON response and also failed to read it as text.",
        };
      }
    }

  } catch (error) {
    console.error('Chat API error (outer catch):', error);
    
    // Return a graceful fallback response
    return {
      text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, I'd love to help you explore Diani Beach - it's known for its pristine white sand beaches, excellent diving spots, and vibrant local culture!"
    };
  }
};