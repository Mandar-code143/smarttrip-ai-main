import { create } from 'zustand';
import { TripInput, ItineraryResult, AgentState } from '@/types/trip';

interface TripStore {
  // Wizard state
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Trip input
  tripInput: Partial<TripInput>;
  updateTripInput: (data: Partial<TripInput>) => void;
  resetTripInput: () => void;
  
  // Results
  itinerary: ItineraryResult | null;
  explanation: string | null;
  agentState: AgentState | null;
  setResults: (itinerary: ItineraryResult, explanation: string, agentState: AgentState) => void;
  clearResults: () => void;
  
  // Loading state
  isLoading: boolean;
  loadingStep: string;
  setLoading: (isLoading: boolean, step?: string) => void;
  
  // Error state
  error: string | null;
  setError: (error: string | null) => void;
}

const defaultTripInput: Partial<TripInput> = {
  budget: 1500,
  currency: "USD",
  days: 5,
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  cities: [],
  preferences: [],
  pace: "balanced",
  safetyBuffer: 10,
};

export const useTripStore = create<TripStore>((set) => ({
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  
  tripInput: defaultTripInput,
  updateTripInput: (data) => set((state) => ({ 
    tripInput: { ...state.tripInput, ...data } 
  })),
  resetTripInput: () => set({ tripInput: defaultTripInput, currentStep: 0 }),
  
  itinerary: null,
  explanation: null,
  agentState: null,
  setResults: (itinerary, explanation, agentState) => set({ 
    itinerary, 
    explanation, 
    agentState 
  }),
  clearResults: () => set({ itinerary: null, explanation: null, agentState: null }),
  
  isLoading: false,
  loadingStep: "",
  setLoading: (isLoading, step = "") => set({ isLoading, loadingStep: step }),
  
  error: null,
  setError: (error) => set({ error }),
}));
