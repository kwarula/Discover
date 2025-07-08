import { corsHeaders } from '../_shared/cors.ts';

const WEBHOOK_URL = 'https://zaidiflow.app.n8n.cloud/webhook-test/diani-agent-live';

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Forward the request body to the webhook
    const requestData = await req.json();
    
    console.log('Forwarding request to webhook:', {
      url: WEBHOOK_URL,
      method: 'POST',
      hasData: !!requestData
    });
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Webhook response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Get response body
    let responseBody;
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
    console.log('Webhook response body:', responseBody);

    // Check if the webhook response is successful
    if (!response.ok) {
      // Propagate the exact status code and body from the webhook
      console.error(`Webhook returned error: ${response.status} ${response.statusText}`);
      
      return new Response(typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody), {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': contentType || 'application/json',
        },
      });
    }

    // Return successful response with webhook data
    return new Response(typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody), {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType || 'application/json',
      },
    });
  } catch (error) {
    console.error('Chat-proxy function error:', error);
    
    // Return a 500 error for internal function errors
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: 'Failed to process request in chat-proxy function',
      details: error.message 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});