import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, actionType } = await req.json();
    
    if (!email || !actionType) {
      return new Response(
        JSON.stringify({ error: 'Missing email or actionType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create appropriate system prompt based on action type
    const systemPrompts: Record<string, string> = {
      'accept': `You are a professional government email assistant. Generate a formal acceptance email that:
- Confirms acceptance of the request
- Thanks the sender
- Provides any next steps if applicable
- Maintains a professional, courteous tone`,
      
      'reject': `You are a professional government email assistant. Generate a polite rejection email that:
- Respectfully declines the request
- Provides a brief, professional reason
- Thanks them for their inquiry
- Offers alternative solutions if possible`,
      
      'request-info': `You are a professional government email assistant. Generate an information request email that:
- Politely requests additional information
- Specifies exactly what information is needed
- Explains why the information is necessary
- Provides a reasonable timeline for response`,
      
      'forward': `You are a professional government email assistant. Generate a forwarding message that:
- Explains why the email is being forwarded
- Indicates which department can better assist
- Maintains professional courtesy
- Thanks them for their patience`,
      
      'acknowledge': `You are a professional government email assistant. Generate an acknowledgment email that:
- Confirms receipt of their email
- Provides an estimated timeline for full response
- Reassures them their request is being processed
- Maintains a professional tone`,
      
      'custom': `You are a professional government email assistant. Generate a professional response email that addresses the sender's request appropriately while maintaining a formal, courteous tone.`
    };

    const systemPrompt = systemPrompts[actionType] || systemPrompts['custom'];

    const userPrompt = `Generate a professional email response for the following:

Original Email:
From: ${email.sender} <${email.senderEmail}>
Subject: ${email.subject}
Body:
${email.body}

Please generate an appropriate response based on the context.`;

    console.log('Calling Lovable AI Gateway...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedResponse = data.choices[0].message.content;

    console.log('Response generated successfully');

    return new Response(
      JSON.stringify({ response: generatedResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
