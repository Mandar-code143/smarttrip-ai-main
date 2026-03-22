import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTripStore } from "@/store/tripStore";
import { getCurrencySymbol } from "@/types/trip";
import { ArrowLeft, Lightbulb, RefreshCw, Plane, Hotel, MapPin } from "lucide-react";
import DayCard from "@/components/trip/DayCard";
import BalanceRadar from "@/components/trip/BalanceRadar";
import ConfidenceMeter from "@/components/trip/ConfidenceMeter";
import UserLearningsPanel from "@/components/trip/UserLearningsPanel";
import BookingLinks from "@/components/trip/BookingLinks";
import EmergencyPanel from "@/components/trip/EmergencyPanel";
import AIDoctor from "@/components/trip/AIDoctor";
import WeatherPanel from "@/components/trip/WeatherPanel";
import HotelSuggestions from "@/components/trip/HotelSuggestions";

const Results = () => {
  const navigate = useNavigate();
  const { itinerary, explanation, tripInput, resetTripInput } = useTripStore();

  useEffect(() => {
    if (!itinerary) navigate("/planner");
  }, [itinerary, navigate]);

  if (!itinerary) return null;

  const currency = tripInput.currency || "USD";
  const currencySymbol = getCurrencySymbol(currency);
  const mainCity = tripInput.cities?.[0] || "Unknown";

  const balanceMetrics = itinerary.balanceMetrics || { cost: 75, experience: 85, fatigue: 40, preferenceMatch: 90 };
  const learnings = itinerary.learnings || {
    preferredPace: "You prefer a balanced approach with rest breaks",
    preferredActivities: tripInput.preferences || ["sightseeing", "food"],
    budgetComfortZone: "Mid-range spending with occasional splurges",
    insights: ["You value cultural experiences", "Prefer morning activities"]
  };

  // Mock weather data
  const weatherData = itinerary.days.map((day, i) => ({
    date: day.date,
    condition: (["sunny", "cloudy", "sunny", "rainy", "sunny"] as const)[i % 5],
    tempHigh: 22 + Math.floor(Math.random() * 8),
    tempLow: 14 + Math.floor(Math.random() * 5),
    precipitation: Math.floor(Math.random() * 40),
  }));

  // Mock hotel suggestions
  const hotelSuggestions = [
    { name: "Comfort Inn", tier: "budget" as const, pricePerNight: 80, rating: 4.1, distance: "2.5 km", aiReason: "Best value near main attractions" },
    { name: "City Central Hotel", tier: "mid" as const, pricePerNight: 150, rating: 4.5, distance: "0.8 km", aiReason: "Chosen to reduce daily travel fatigue" },
    { name: "Grand Plaza", tier: "premium" as const, pricePerNight: 280, rating: 4.8, distance: "0.3 km", aiReason: "Premium location with top amenities" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/planner")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Your Itinerary</h1>
              <p className="text-muted-foreground">{tripInput.cities?.join(" → ")} • {tripInput.days} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EmergencyPanel city={mainCity} />
            <Button variant="outline" onClick={() => { resetTripInput(); navigate("/planner"); }} className="rounded-xl">
              <RefreshCw className="h-4 w-4 mr-2" /> New Trip
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Summary */}
            <div className="glass rounded-3xl p-6 shadow-card border border-border/50">
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="font-display text-2xl font-bold text-foreground">{currencySymbol}{itinerary.totalCost.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                  <p className="font-display text-2xl font-bold text-primary">{itinerary.budgetUsed.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="font-display text-2xl font-bold text-success">{currencySymbol}{itinerary.budgetRemaining.toFixed(0)}</p>
                </div>
              </div>
              <ConfidenceMeter confidence={itinerary.overallConfidence || 82} riskFlags={itinerary.warnings.length > 0 ? ["Budget tight"] : []} />
            </div>

            {/* AI Explanation */}
            <div className="glass rounded-3xl p-6 shadow-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold">Here's why I planned it this way...</h2>
              </div>
              <p className="text-muted-foreground whitespace-pre-line">{explanation}</p>
            </div>

            {/* Booking Links */}
            <div className="grid sm:grid-cols-2 gap-4">
              <BookingLinks type="hotel" city={mainCity} dates={{ start: tripInput.startDate || "", end: "" }} />
              <BookingLinks type="transport" city={mainCity} />
            </div>

            {/* Day Cards */}
            <div className="space-y-4">
              {itinerary.days.map((day) => (
                <DayCard key={day.day} day={day} currency={currency} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WeatherPanel city={mainCity} days={weatherData} />
            <HotelSuggestions city={mainCity} currency={currency} currencySymbol={currencySymbol} hotels={hotelSuggestions} />
            <BalanceRadar metrics={balanceMetrics} />
            <UserLearningsPanel learnings={learnings} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="ghost" className="rounded-xl">
              <Plane className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
      
      {/* AI Doctor Floating Button */}
      <AIDoctor city={mainCity} />
    </div>
  );
};

export default Results;
