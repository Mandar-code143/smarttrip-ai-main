import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history, city } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a helpful AI health assistant for travelers. Your role is to:

1. Provide general health information and first-aid guidance
2. Help travelers understand common symptoms
3. Suggest when to seek professional medical help
4. Recommend nearby medical facilities when appropriate

IMPORTANT RULES:
- Never diagnose specific conditions
- Always recommend professional medical help for serious symptoms
- Be calm, supportive, and reassuring
- Keep responses concise but helpful
- If symptoms sound serious (chest pain, difficulty breathing, severe bleeding, loss of consciousness, stroke symptoms), IMMEDIATELY recommend calling emergency services

${city ? `The traveler is currently in or near: ${city}` : ""}

CRITICAL: Start serious symptom responses with "⚠️ SEEK IMMEDIATE MEDICAL ATTENTION" and provide emergency guidance.

For minor issues, provide:
1. General information about the symptom
2. Simple self-care suggestions
3. When to see a doctor
4. Travel-specific tips if relevant`;

    const messages: Message[] = [
      ...(history || []),
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Doctor error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Unable to process request",
        response: "I'm having trouble connecting. If this is urgent, please contact emergency services or visit a nearby hospital."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
