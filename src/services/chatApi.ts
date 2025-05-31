import { ChatApiRequest, ChatApiResponse } from '@/types';

const API_ENDPOINT = 'https://n8n.zaidicreatorlab.com/webhook/b65b3de6-506a-4c2a-86be-9bfd1c81d8ea';

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

    // Get the response as text first to see what we're receiving
    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let data;
    try {
      // Try to parse as JSON
      data = JSON.parse(responseText);
      console.log('Parsed JSON data:', data);
    } catch (parseError) {
      console.log('Response is not JSON, treating as plain text');
      // If it's not JSON, treat the response as plain text
      return {
        text: responseText
      };
    }
    
    // Handle different possible response formats from n8n
    if (typeof data === 'string') {
      return { text: data };
    }
    
    // If the response is already in the expected format with text and possibly richContent
    if (data && typeof data.text === 'string') {
      // Return the entire response object, which may include richContent
      return data;
    }
    
    // Fallback to other possible response formats
    if (data && typeof data.message === 'string') {
      return { text: data.message };
    }
    
    if (data && typeof data.response === 'string') {
      return { text: data.response };
    }

    // If we can't find text in expected fields, log the structure
    console.error('Unexpected response format:', data);
    console.error('Available keys:', Object.keys(data || {}));
    
    return {
      text: "I received a response but couldn't parse it properly. The webhook is working, but the response format might need adjustment."
    };

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a graceful fallback response
    return {
      text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, I'd love to help you explore Diani Beach - it's known for its pristine white sand beaches, excellent diving spots, and vibrant local culture!"
    };
  }
};