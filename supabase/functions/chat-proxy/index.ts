import { corsHeaders } from '../_shared/cors.ts';
const WEBHOOK_URL = 'https://zaidiflow.app.n8n.cloud/webhook/discover-diani-live';
// Default fallback suggestions for Diani Beach
const getDefaultSuggestions = ()=>({
    type: 'suggestion',
    data: {
      suggestions: [
        "Show me the best restaurants",
        "Find beach activities",
        "Recommend hotels",
        "Transport options"
      ],
      highlights: [
        "25km of pristine beaches",
        "World-class kitesurfing",
        "Rich Swahili culture",
        "Tropical climate year-round"
      ]
    }
  });
Deno.serve(async (req)=>{
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  try {
    const requestText = await req.text();
    let requestData;
    try {
      requestData = JSON.parse(requestText);
    } catch (parseErr) {
      const errorResponse = {
        text: "I couldn't understand your request. Please try again.",
        richContent: getDefaultSuggestions(),
        isUser: false,
        timestamp: new Date().toISOString(),
        error: true
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Validate required fields
    if (!requestData.message || !requestData.userId) {
      const errorResponse = {
        text: "Please provide both a message and user ID.",
        richContent: getDefaultSuggestions(),
        isUser: false,
        timestamp: new Date().toISOString(),
        error: true
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Forward to n8n webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    const contentType = webhookResponse.headers.get('Content-Type') || '';
    let webhookData;
    if (contentType.includes('application/json')) {
      try {
        webhookData = await webhookResponse.json();
      } catch  {
        webhookData = {
          text: "I'm having trouble processing your request right now.",
          error: true
        };
      }
    } else {
      const rawText = await webhookResponse.text();
      webhookData = {
        text: rawText || "I received your message but couldn't generate a proper response."
      };
    }
    // Transform webhook response to match ChatApiResponse format
    const chatResponse = {
      text: webhookData.text || webhookData.message || "I'm here to help you discover Diani Beach!",
      richContent: webhookData.richContent || getDefaultSuggestions(),
      isUser: false,
      timestamp: new Date().toISOString(),
      metadata: {
        userId: requestData.userId,
        sessionId: requestData.context?.sessionId,
        originalQuery: requestData.message
      },
      error: !webhookResponse.ok
    };
    // Return success response with proper status
    return new Response(JSON.stringify(chatResponse), {
      status: webhookResponse.ok ? 200 : 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Edge Function error:', err);
    const errorResponse = {
      text: "I'm experiencing technical difficulties. Please try again in a moment.",
      richContent: getDefaultSuggestions(),
      isUser: false,
      timestamp: new Date().toISOString(),
      error: true,
      metadata: {
        userId: 'unknown'
      }
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
