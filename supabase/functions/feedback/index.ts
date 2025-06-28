import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const feedback = await req.json();
    
    // Log feedback for now (in production, store in database)
    console.log('User feedback received:', {
      messageId: feedback.messageId,
      userId: feedback.userId,
      feedbackType: feedback.feedbackType,
      rating: feedback.rating,
      timestamp: feedback.timestamp
    });

    // In production, you would:
    // 1. Validate the feedback data
    // 2. Store in Supabase database
    // 3. Potentially trigger analytics events
    // 4. Send to ML training pipeline

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Feedback received successfully' 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Feedback error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to process feedback' 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});