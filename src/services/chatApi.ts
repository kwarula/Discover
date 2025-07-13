import { ChatApiRequest, ChatApiResponse } from '@/types';
import { offlineService } from '@/services/offlineService';

// Use Supabase Edge Function to proxy requests and handle CORS
const CHAT_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-proxy`;

export const sendChatMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  // Check if offline
  if (!offlineService.getOnlineStatus()) {
    return {
      text: "I'm currently offline, but I can still help with general information about Diani Beach! The area is famous for its pristine white sand beaches, crystal-clear waters, and vibrant coral reefs. Popular activities include dolphin watching, snorkeling, kite surfing, and exploring local restaurants. When you're back online, I'll have access to real-time recommendations and can help you book specific services.",
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
      
      // Try to get error details from response
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
      responseData = {
        text: textResponse || "I received your message but got an unexpected response format. Please try again.",
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
    
    // Return a graceful fallback response
    return {
      text: "I'm having trouble connecting to my knowledge base right now. This might be a temporary network issue. Meanwhile, I'd be happy to share some general information about Diani Beach! It's renowned for its pristine white sand beaches, crystal-clear waters, and amazing coral reefs perfect for snorkeling and diving. Please try your question again in a moment.",
    };
  }
};