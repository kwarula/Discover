import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface FeedbackData {
  messageId: string;
  userId: string;
  feedbackType: 'helpful' | 'not_helpful' | 'inappropriate' | 'inaccurate';
  rating?: number;
  comment?: string;
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const feedback: FeedbackData = await req.json();
    
    // Validate required fields
    if (!feedback.messageId || !feedback.userId || !feedback.feedbackType) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields' 
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Insert feedback into database
    const { data, error } = await supabaseClient
      .from('message_feedback')
      .insert([
        {
          message_id: feedback.messageId,
          user_id: feedback.userId,
          feedback_type: feedback.feedbackType,
          rating: feedback.rating,
          comment: feedback.comment,
          created_at: feedback.timestamp
        }
      ]);

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to save feedback' 
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

    console.log('Feedback saved successfully:', {
      messageId: feedback.messageId,
      userId: feedback.userId,
      feedbackType: feedback.feedbackType
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your feedback! This helps us improve.' 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Feedback processing error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'An error occurred while processing your feedback' 
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