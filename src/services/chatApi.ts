
import { ChatApiRequest, ChatApiResponse } from '@/types';

const API_ENDPOINT = 'https://n8n.zaidicreatorlab.com/webhook/33346bfe-1a4c-4051-b596-a658609a6080';

export const sendChatMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  try {
    console.log('Sending chat request:', request);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('API Response status:', response.status);

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

    const data = await response.json();
    console.log('API Response data:', data);
    
    // Validate response format
    if (!data || typeof data.text !== 'string') {
      console.error('Invalid response format:', data);
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
