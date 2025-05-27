
import { ChatApiRequest, ChatApiResponse } from '@/types';

const API_ENDPOINT = 'https://n8n.zaidicreatorlab.com/webhook/33346bfe-1a4c-4051-b596-a658609a6080';

export const sendChatMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response format
    if (!data || typeof data.text !== 'string') {
      throw new Error('Invalid response format from API');
    }

    return data;
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a graceful fallback response
    return {
      text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, I'd love to help you explore Diani Beach - it's known for its pristine white sand beaches, excellent diving spots, and vibrant local culture!"
    };
  }
};
