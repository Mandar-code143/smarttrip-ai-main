export interface TripInput {
  budget: number;
  currency: string;
  days: number;
  startDate: string;
  cities: string[];
  preferences: string[];
  pace: "relaxed" | "balanced" | "packed";
  safetyBuffer: number;
}

export interface Activity {
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
  alternatives?: ActivityAlternative[];
  confidence?: number;
}

export interface ActivityAlternative {
  name: string;
  cost: number;
  type: "cheaper" | "premium";
  tradeoff: string;
}

export interface DayPlan {
  day: number;
  date: string;
  city: string;
  activities: Activity[];
  totalCost: number;
  totalDuration: number;
  totalEnergy: number;
  fatigueLevel: "low" | "medium" | "high";
  dayExplanation?: string;
  confidence?: number;
  riskFlags?: string[];
}

export interface BalanceMetrics {
  cost: number;
  experience: number;
  fatigue: number;
  preferenceMatch: number;
}

export interface ItineraryResult {
  days: DayPlan[];
  totalCost: number;
  budgetUsed: number;
  budgetRemaining: number;
  safetyBufferUsed: number;
  warnings: string[];
  reasoning: string;
  tradeoffs: string[];
  overallConfidence: number;
  balanceMetrics: BalanceMetrics;
  learnings: UserLearnings;
}

export interface UserLearnings {
  preferredPace: string;
  preferredActivities: string[];
  budgetComfortZone: string;
  insights: string[];
}

export interface AgentStep {
  step: string;
  status: "pending" | "active" | "complete" | "replanning";
  message: string;
  timestamp?: number;
  confidence?: number;
}

export interface AgentState {
  iterations: number;
  finalStep: string;
  logs: string[];
  steps: AgentStep[];
  replanningTriggered: boolean;
  replanReason?: string;
  affectedDays?: number[];
}

export interface TripPlannerResponse {
  success: boolean;
  itinerary: ItineraryResult;
  explanation: string;
  agentState: AgentState;
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
];

export const PREFERENCES = [
  { id: "sightseeing", label: "Sightseeing", icon: "🏛️", description: "Famous landmarks & attractions" },
  { id: "adventure", label: "Adventure", icon: "🎢", description: "Thrilling activities & sports" },
  { id: "food", label: "Food & Dining", icon: "🍽️", description: "Local cuisine & restaurants" },
  { id: "nightlife", label: "Nightlife", icon: "🎉", description: "Bars, clubs & entertainment" },
  { id: "relaxation", label: "Relaxation", icon: "🧘", description: "Spas, beaches & wellness" },
  { id: "shopping", label: "Shopping", icon: "🛍️", description: "Markets & retail therapy" },
  { id: "culture", label: "Culture", icon: "🎭", description: "Museums, art & history" },
  { id: "nature", label: "Nature", icon: "🌿", description: "Parks, hiking & wildlife" },
];

export const PACE_OPTIONS = [
  { 
    id: "relaxed" as const, 
    label: "Relaxed", 
    description: "Fewer activities, more downtime (max 6 hours/day)",
    icon: "🐢"
  },
  { 
    id: "balanced" as const, 
    label: "Balanced", 
    description: "Mix of activities and rest (max 8 hours/day)",
    icon: "⚖️"
  },
  { 
    id: "packed" as const, 
    label: "Packed", 
    description: "Maximize experiences (max 10 hours/day)",
    icon: "🚀"
  },
];

export const getCurrencySymbol = (code: string): string => {
  return CURRENCIES.find(c => c.code === code)?.symbol || code;
};
