import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TripInput {
  budget: number;
  currency: string;
  days: number;
  startDate: string;
  cities: string[];
  preferences: string[];
  pace: "relaxed" | "balanced" | "packed";
  safetyBuffer: number;
}

interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  cost: number;
  category: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  energyLevel: "low" | "medium" | "high";
  location: string;
  image?: string;
}

interface DayPlan {
  day: number;
  date: string;
  city: string;
  activities: Activity[];
  totalCost: number;
  totalDuration: number;
  totalEnergy: number;
}

interface ItineraryResult {
  days: DayPlan[];
  totalCost: number;
  budgetUsed: number;
  budgetRemaining: number;
  safetyBufferUsed: number;
  warnings: string[];
  reasoning: string;
  tradeoffs: string[];
}

interface AgentState {
  step: string;
  iteration: number;
  currentPlan: ItineraryResult | null;
  constraints: {
    budgetExceeded: boolean;
    timeExceeded: boolean;
    fatigueHigh: boolean;
  };
  logs: string[];
}

// Helper to generate activity ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Calculate energy score (0-100)
const calculateDailyEnergy = (activities: Activity[]): number => {
  const energyMap = { low: 20, medium: 40, high: 60 };
  return activities.reduce((sum, a) => sum + energyMap[a.energyLevel], 0);
};

// Validate constraints
const validateConstraints = (plan: ItineraryResult, input: TripInput): { budgetExceeded: boolean; timeExceeded: boolean; fatigueHigh: boolean } => {
  const effectiveBudget = input.budget * (1 - input.safetyBuffer / 100);
  const budgetExceeded = plan.totalCost > effectiveBudget;
  
  const maxDailyHours = input.pace === "relaxed" ? 6 : input.pace === "balanced" ? 8 : 10;
  const timeExceeded = plan.days.some(d => d.totalDuration > maxDailyHours * 60);
  
  const maxEnergy = input.pace === "relaxed" ? 80 : input.pace === "balanced" ? 120 : 160;
  const fatigueHigh = plan.days.some(d => d.totalEnergy > maxEnergy);
  
  return { budgetExceeded, timeExceeded, fatigueHigh };
};

// Call AI for planning
async function callAI(prompt: string, systemPrompt: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  console.log("[AI] Calling Lovable AI Gateway...");
  
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
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[AI] Error:", response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// STEP 1: Initial Planning Agent
async function planTrip(input: TripInput, state: AgentState): Promise<ItineraryResult> {
  state.step = "PLANNING";
  state.logs.push(`[${new Date().toISOString()}] Starting initial planning for ${input.cities.join(", ")}`);
  
  const systemPrompt = `You are an expert travel planner AI. You must create detailed day-by-day itineraries.
  
Your task is to create a realistic travel plan with specific activities, costs, and timing.

CRITICAL RULES:
1. Each activity must have: name, description, duration (in minutes), cost (in USD), category, timeOfDay, energyLevel, location
2. Categories: sightseeing, adventure, food, nightlife, relaxation, shopping, culture, nature
3. timeOfDay: morning, afternoon, evening, night
4. energyLevel: low, medium, high
5. Be realistic with costs and durations
6. Consider travel time between locations
7. Match activities to user preferences

You MUST respond with ONLY valid JSON in this exact format:
{
  "days": [
    {
      "day": 1,
      "date": "2024-01-15",
      "city": "Paris",
      "activities": [
        {
          "name": "Eiffel Tower Visit",
          "description": "Iconic landmark with stunning city views",
          "duration": 120,
          "cost": 26,
          "category": "sightseeing",
          "timeOfDay": "morning",
          "energyLevel": "medium",
          "location": "Champ de Mars, 5 Avenue Anatole France"
        }
      ]
    }
  ],
  "reasoning": "Explanation of planning decisions and trade-offs made"
}`;

  const prompt = `Create a ${input.days}-day travel itinerary for ${input.cities.join(", ")}.

Budget: ${input.budget} ${input.currency} (with ${input.safetyBuffer}% safety buffer = effective budget of ${input.budget * (1 - input.safetyBuffer / 100)} ${input.currency})
Start Date: ${input.startDate}
Pace: ${input.pace} (${input.pace === "relaxed" ? "max 6 hours/day" : input.pace === "balanced" ? "max 8 hours/day" : "max 10 hours/day"})
Preferences: ${input.preferences.join(", ")}

Create an optimized itinerary that:
1. Stays within the effective budget
2. Matches the ${input.pace} pace
3. Prioritizes: ${input.preferences.slice(0, 3).join(", ")}
4. Groups nearby activities to minimize travel time
5. Balances energy levels throughout each day

Return ONLY the JSON response.`;

  const aiResponse = await callAI(prompt, systemPrompt);
  state.logs.push(`[${new Date().toISOString()}] AI planning response received`);
  
  try {
    // Parse the JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Process and validate the response
    const days: DayPlan[] = parsed.days.map((day: any) => {
      const activities: Activity[] = day.activities.map((a: any) => ({
        id: generateId(),
        name: a.name || "Unknown Activity",
        description: a.description || "",
        duration: a.duration || 60,
        cost: a.cost || 0,
        category: a.category || "sightseeing",
        timeOfDay: a.timeOfDay || "morning",
        energyLevel: a.energyLevel || "medium",
        location: a.location || day.city,
      }));
      
      return {
        day: day.day,
        date: day.date || input.startDate,
        city: day.city || input.cities[0],
        activities,
        totalCost: activities.reduce((sum: number, a: Activity) => sum + a.cost, 0),
        totalDuration: activities.reduce((sum: number, a: Activity) => sum + a.duration, 0),
        totalEnergy: calculateDailyEnergy(activities),
      };
    });
    
    const totalCost = days.reduce((sum, d) => sum + d.totalCost, 0);
    
    return {
      days,
      totalCost,
      budgetUsed: (totalCost / input.budget) * 100,
      budgetRemaining: input.budget - totalCost,
      safetyBufferUsed: 0,
      warnings: [],
      reasoning: parsed.reasoning || "Initial plan created based on preferences and constraints.",
      tradeoffs: [],
    };
  } catch (error) {
    console.error("[PLAN] Parse error:", error);
    state.logs.push(`[${new Date().toISOString()}] Error parsing AI response: ${error}`);
    throw new Error("Failed to parse AI planning response");
  }
}

// STEP 2: Re-planning Agent (when constraints fail)
async function replanTrip(input: TripInput, currentPlan: ItineraryResult, constraints: { budgetExceeded: boolean; timeExceeded: boolean; fatigueHigh: boolean }, state: AgentState): Promise<ItineraryResult> {
  state.step = "REPLANNING";
  state.iteration++;
  state.logs.push(`[${new Date().toISOString()}] Re-planning iteration ${state.iteration} due to: ${Object.entries(constraints).filter(([_, v]) => v).map(([k]) => k).join(", ")}`);
  
  const systemPrompt = `You are a travel optimization AI. Your job is to FIX a travel plan that violates constraints.

You must ANALYZE the current plan and make STRATEGIC DECISIONS about what to remove or modify to meet constraints.

IMPORTANT:
1. Prioritize keeping high-value, unique experiences
2. Remove or substitute expensive activities first
3. Consider combining similar activities
4. Maintain the overall travel experience quality

You MUST respond with ONLY valid JSON in the same format as the original plan, plus:
- "removedActivities": list of what was removed and why
- "substitutions": list of any substitutions made
- "reasoning": detailed explanation of optimization decisions`;

  const effectiveBudget = input.budget * (1 - input.safetyBuffer / 100);
  const overage = currentPlan.totalCost - effectiveBudget;
  
  const prompt = `The current travel plan violates these constraints:
${constraints.budgetExceeded ? `- BUDGET EXCEEDED by ${overage.toFixed(2)} ${input.currency}. Current: ${currentPlan.totalCost} ${input.currency}, Limit: ${effectiveBudget} ${input.currency}` : ""}
${constraints.timeExceeded ? `- TIME EXCEEDED on some days. Max ${input.pace === "relaxed" ? "6" : input.pace === "balanced" ? "8" : "10"} hours/day allowed.` : ""}
${constraints.fatigueHigh ? `- FATIGUE TOO HIGH on some days. Consider easier activities or more rest.` : ""}

Current Plan:
${JSON.stringify(currentPlan.days, null, 2)}

User Preferences (prioritize keeping these): ${input.preferences.join(", ")}
Budget: ${effectiveBudget} ${input.currency}

OPTIMIZE the plan to fix ALL constraint violations while maintaining the best possible travel experience.
Explain your trade-off decisions clearly.

Return ONLY the JSON response.`;

  const aiResponse = await callAI(prompt, systemPrompt);
  state.logs.push(`[${new Date().toISOString()}] AI re-planning response received`);
  
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    const days: DayPlan[] = parsed.days.map((day: any) => {
      const activities: Activity[] = day.activities.map((a: any) => ({
        id: generateId(),
        name: a.name || "Unknown Activity",
        description: a.description || "",
        duration: a.duration || 60,
        cost: a.cost || 0,
        category: a.category || "sightseeing",
        timeOfDay: a.timeOfDay || "morning",
        energyLevel: a.energyLevel || "medium",
        location: a.location || day.city,
      }));
      
      return {
        day: day.day,
        date: day.date || input.startDate,
        city: day.city || input.cities[0],
        activities,
        totalCost: activities.reduce((sum: number, a: Activity) => sum + a.cost, 0),
        totalDuration: activities.reduce((sum: number, a: Activity) => sum + a.duration, 0),
        totalEnergy: calculateDailyEnergy(activities),
      };
    });
    
    const totalCost = days.reduce((sum, d) => sum + d.totalCost, 0);
    const tradeoffs = parsed.removedActivities?.map((r: any) => `Removed "${r.name || r}": ${r.reason || "to optimize budget/time"}`) || [];
    if (parsed.substitutions) {
      tradeoffs.push(...parsed.substitutions.map((s: any) => `Substituted: ${s}`));
    }
    
    return {
      days,
      totalCost,
      budgetUsed: (totalCost / input.budget) * 100,
      budgetRemaining: input.budget - totalCost,
      safetyBufferUsed: Math.max(0, (currentPlan.totalCost - totalCost) / input.budget * 100),
      warnings: currentPlan.warnings,
      reasoning: parsed.reasoning || `Optimized plan after iteration ${state.iteration}`,
      tradeoffs: [...currentPlan.tradeoffs, ...tradeoffs],
    };
  } catch (error) {
    console.error("[REPLAN] Parse error:", error);
    state.logs.push(`[${new Date().toISOString()}] Error parsing AI re-planning response: ${error}`);
    // Return current plan with warning if re-planning fails
    return {
      ...currentPlan,
      warnings: [...currentPlan.warnings, "Re-planning failed, showing best available plan"],
    };
  }
}

// STEP 3: Explanation Agent
async function generateExplanation(input: TripInput, finalPlan: ItineraryResult, state: AgentState): Promise<string> {
  state.step = "EXPLAINING";
  state.logs.push(`[${new Date().toISOString()}] Generating explanation for final plan`);
  
  const systemPrompt = `You are a friendly travel expert explaining trip decisions to a traveler.

Write in a warm, conversational tone. Explain:
1. Why this itinerary was chosen
2. Key trade-offs made (if any)
3. Tips for enjoying the trip
4. Why certain activities were prioritized

Keep it concise but insightful - about 2-3 paragraphs.`;

  const prompt = `Explain this ${input.days}-day trip to ${input.cities.join(", ")}:

Budget Used: ${finalPlan.budgetUsed.toFixed(1)}% (${finalPlan.totalCost} of ${input.budget} ${input.currency})
Pace: ${input.pace}
Preferences: ${input.preferences.join(", ")}

Itinerary Summary:
${finalPlan.days.map(d => `Day ${d.day} (${d.city}): ${d.activities.map(a => a.name).join(", ")} - Total: ${d.totalCost} ${input.currency}`).join("\n")}

${finalPlan.tradeoffs.length > 0 ? `Trade-offs made:\n${finalPlan.tradeoffs.join("\n")}` : ""}

${state.iteration > 0 ? `Note: Plan was optimized ${state.iteration} time(s) to meet constraints.` : ""}

Write a friendly explanation of this trip plan and the decisions made.`;

  return await callAI(prompt, systemPrompt);
}

// Main Agent Loop
async function runAgentLoop(input: TripInput): Promise<{ result: ItineraryResult; explanation: string; state: AgentState }> {
  const state: AgentState = {
    step: "INITIALIZING",
    iteration: 0,
    currentPlan: null,
    constraints: {
      budgetExceeded: false,
      timeExceeded: false,
      fatigueHigh: false,
    },
    logs: [],
  };
  
  const MAX_ITERATIONS = 3;
  
  try {
    // Step 1: Initial Planning
    state.currentPlan = await planTrip(input, state);
    
    // Step 2: Validation Loop
    state.constraints = validateConstraints(state.currentPlan, input);
    
    while (
      (state.constraints.budgetExceeded || state.constraints.timeExceeded || state.constraints.fatigueHigh) &&
      state.iteration < MAX_ITERATIONS
    ) {
      state.currentPlan = await replanTrip(input, state.currentPlan, state.constraints, state);
      state.constraints = validateConstraints(state.currentPlan, input);
    }
    
    // Add warnings if constraints still not met
    if (state.constraints.budgetExceeded) {
      state.currentPlan.warnings.push(`Budget is ${(state.currentPlan.budgetUsed - 100 + input.safetyBuffer).toFixed(1)}% over target after optimization`);
    }
    if (state.constraints.timeExceeded) {
      state.currentPlan.warnings.push("Some days may feel rushed - consider a more relaxed pace");
    }
    if (state.constraints.fatigueHigh) {
      state.currentPlan.warnings.push("Energy levels are high - plan for rest breaks");
    }
    
    // Step 3: Generate Explanation
    const explanation = await generateExplanation(input, state.currentPlan, state);
    
    state.step = "COMPLETE";
    state.logs.push(`[${new Date().toISOString()}] Agent loop complete after ${state.iteration} optimization iterations`);
    
    return {
      result: state.currentPlan,
      explanation,
      state,
    };
  } catch (error) {
    state.step = "ERROR";
    state.logs.push(`[${new Date().toISOString()}] Agent error: ${error}`);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: TripInput = await req.json();
    
    console.log("[TRIP-PLANNER] Starting agent loop for:", input.cities);
    
    // Validate input
    if (!input.budget || !input.days || !input.cities?.length) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: budget, days, cities" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Run the agent loop
    const { result, explanation, state } = await runAgentLoop(input);
    
    console.log("[TRIP-PLANNER] Agent complete. Iterations:", state.iteration);
    
    return new Response(
      JSON.stringify({
        success: true,
        itinerary: result,
        explanation,
        agentState: {
          iterations: state.iteration,
          finalStep: state.step,
          logs: state.logs,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("[TRIP-PLANNER] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    if (errorMessage.includes("Rate limit")) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
