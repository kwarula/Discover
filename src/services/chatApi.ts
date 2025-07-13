import { ChatApiRequest, ChatApiResponse } from '@/types';
import { offlineService } from '@/services/offlineService';

// Direct webhook URL - bypassing Supabase Edge Function
const WEBHOOK_URL = 'https://zaidiflow.app.n8n.cloud/webhook/discover-diani-live';

export const sendChatMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  // Check if offline
  if (!offlineService.getOnlineStatus()) {
    return {
      text: "I'm currently offline, but I can still help with general information about Diani Beach! The area is famous for its pristine white sand beaches, crystal-clear waters, and vibrant coral reefs. Popular activities include dolphin watching, snorkeling, kite surfing, and exploring local restaurants. When you're back online, I'll have access to real-time recommendations and can help you book specific services.",
      offline: true
    };
  }

  try {
    console.log('Sending chat request directly to webhook:', {
      url: WEBHOOK_URL,
      userProfile: request.userProfile ? 'included' : 'not included',
      userLocation: request.userLocation ? 'included' : 'not included',
      context: request.context ? 'included' : 'not included'
    });
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add any additional headers your webhook might need
        'User-Agent': 'DiscoverDiani/1.0',
      },
      body: JSON.stringify(request),
    });

    console.log('Webhook response status:', response.status);
    console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error(`Webhook error! status: ${response.status} ${response.statusText}`);
      
      // Try to get error details from response
      let errorDetails = '';
      try {
        const errorText = await response.text();
        errorDetails = errorText ? ` - ${errorText}` : '';
      } catch (e) {
        console.error('Could not read error response:', e);
      }
      
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}${errorDetails}`);
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

    console.log('Parsed webhook response:', responseData);
    return responseData;

  } catch (error) {
    console.error('Chat API error (direct webhook):', error);
    
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