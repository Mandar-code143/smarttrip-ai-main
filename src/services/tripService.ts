import { supabase } from '@/integrations/supabase/client';
import { TripInput, TripPlannerResponse } from '@/types/trip';

export async function planTrip(input: TripInput): Promise<TripPlannerResponse> {
  const { data, error } = await supabase.functions.invoke('trip-planner', {
    body: input,
  });

  if (error) {
    console.error('Trip planner error:', error);
    throw new Error(error.message || 'Failed to plan trip');
  }

  if (!data.success) {
    throw new Error(data.error || 'Trip planning failed');
  }

  return data as TripPlannerResponse;
}
