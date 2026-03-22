import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTripStore } from "@/store/tripStore";
import { planTrip } from "@/services/tripService";
import { CURRENCIES, PREFERENCES, PACE_OPTIONS, TripInput } from "@/types/trip";
import { ArrowLeft, ArrowRight, Plane, Loader2, MapPin, X, Sparkles, CheckCircle, Brain, RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";
import AgentThinking from "@/components/trip/AgentThinking";

const STEPS = ["Budget", "Duration", "Destination", "Preferences", "Pace"];

const Planner = () => {
  const navigate = useNavigate();
  const { tripInput, updateTripInput, setResults, setLoading, isLoading, loadingStep, setError } = useTripStore();
  const [step, setStep] = useState(0);
  const [cityInput, setCityInput] = useState("");
  const [agentSteps, setAgentSteps] = useState<Array<{ step: string; status: "pending" | "active" | "complete" | "replanning"; message: string }>>([
    { step: "Understanding", status: "pending", message: "Analyzing your preferences..." },
    { step: "Planning", status: "pending", message: "Creating your itinerary..." },
    { step: "Validating", status: "pending", message: "Checking budget & constraints..." },
    { step: "Optimizing", status: "pending", message: "Perfecting your trip..." },
    { step: "Explaining", status: "pending", message: "Preparing insights..." },
  ]);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const addCity = () => {
    if (cityInput.trim() && !tripInput.cities?.includes(cityInput.trim())) {
      updateTripInput({ cities: [...(tripInput.cities || []), cityInput.trim()] });
      setCityInput("");
    }
  };

  const removeCity = (city: string) => {
    updateTripInput({ cities: tripInput.cities?.filter(c => c !== city) || [] });
  };

  const togglePreference = (id: string) => {
    const current = tripInput.preferences || [];
    if (current.includes(id)) {
      updateTripInput({ preferences: current.filter(p => p !== id) });
    } else {
      updateTripInput({ preferences: [...current, id] });
    }
  };

  const simulateAgentProgress = () => {
    const steps = [...agentSteps];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        steps[currentIndex].status = "active";
        setAgentSteps([...steps]);
        
        setTimeout(() => {
          steps[currentIndex].status = "complete";
          setAgentSteps([...steps]);
          currentIndex++;
        }, 1500);
      } else {
        clearInterval(interval);
      }
    }, 2000);
    
    return interval;
  };

  const handleSubmit = async () => {
    if (!tripInput.cities?.length) {
      toast.error("Please add at least one destination");
      return;
    }
    if (!tripInput.preferences?.length) {
      toast.error("Please select at least one preference");
      return;
    }

    try {
      setLoading(true, "Understanding your trip...");
      const progressInterval = simulateAgentProgress();
      
      const result = await planTrip(tripInput as TripInput);
      
      clearInterval(progressInterval);
      setResults(result.itinerary, result.explanation, result.agentState);
      setLoading(false);
      navigate("/results");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to plan trip";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 w-full">
          {/* Central Animation */}
          <div className="text-center mb-12">
            <div className="relative mx-auto w-32 h-32 mb-8">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin-slow" />
              {/* Middle ring */}
              <div className="absolute inset-4 rounded-full border-4 border-primary/40 animate-spin-slow" style={{ animationDirection: "reverse" }} />
              {/* Center */}
              <div className="absolute inset-8 rounded-full gradient-primary flex items-center justify-center shadow-glow animate-pulse-soft">
                <Brain className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">AI is Planning Your Trip</h2>
            <p className="text-muted-foreground">{loadingStep}</p>
          </div>
          
          {/* Agent Steps Timeline */}
          <div className="glass rounded-3xl p-6 border border-border/50">
            <div className="space-y-4">
              {agentSteps.map((agentStep, i) => (
                <div 
                  key={agentStep.step}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    agentStep.status === "active" ? "bg-primary/10 border border-primary/20" :
                    agentStep.status === "complete" ? "bg-success/10" :
                    agentStep.status === "replanning" ? "bg-warning/10 border border-warning/20" :
                    "opacity-50"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    agentStep.status === "active" ? "gradient-primary animate-pulse-soft" :
                    agentStep.status === "complete" ? "bg-success" :
                    agentStep.status === "replanning" ? "bg-warning animate-pulse-soft" :
                    "bg-muted"
                  }`}>
                    {agentStep.status === "complete" ? (
                      <CheckCircle className="h-5 w-5 text-success-foreground" />
                    ) : agentStep.status === "replanning" ? (
                      <RefreshCw className="h-5 w-5 text-warning-foreground animate-spin" />
                    ) : agentStep.status === "active" ? (
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{agentStep.step}</p>
                    <p className="text-sm text-muted-foreground">{agentStep.message}</p>
                  </div>
                  {agentStep.status === "active" && (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-xl hover:bg-primary/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">Plan Your Trip</h1>
            <p className="text-muted-foreground">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
          </div>
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => i < step && setStep(i)}
              className={`h-2 flex-1 rounded-full transition-all ${
                i === step ? "gradient-primary shadow-glow" : 
                i < step ? "bg-primary/60" : 
                "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="glass rounded-3xl p-8 shadow-card border border-border/50 mb-8">
          {step === 0 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h2 className="font-display text-xl font-bold">What's your budget?</h2>
                <p className="text-muted-foreground text-sm">AI will optimize activities to fit</p>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block">Total Budget</Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {CURRENCIES.find(c => c.code === tripInput.currency)?.symbol}
                    </span>
                    <Input
                      type="number"
                      value={tripInput.budget}
                      onChange={(e) => updateTripInput({ budget: Number(e.target.value) })}
                      className="text-2xl font-bold rounded-xl pl-10 h-14"
                    />
                  </div>
                  <select
                    value={tripInput.currency}
                    onChange={(e) => updateTripInput({ currency: e.target.value })}
                    className="px-4 rounded-xl border border-input bg-background font-medium"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block">Safety Buffer: {tripInput.safetyBuffer}%</Label>
                <Slider
                  value={[tripInput.safetyBuffer || 10]}
                  onValueChange={([v]) => updateTripInput({ safetyBuffer: v })}
                  min={5}
                  max={20}
                  step={1}
                />
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Reserve for unexpected expenses
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📅</span>
                </div>
                <h2 className="font-display text-xl font-bold">When are you traveling?</h2>
                <p className="text-muted-foreground text-sm">AI considers weather and seasonal events</p>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block">Number of Days</Label>
                <div className="grid grid-cols-5 gap-2">
                  {[3, 5, 7, 10, 14].map((d) => (
                    <button
                      key={d}
                      onClick={() => updateTripInput({ days: d })}
                      className={`h-14 rounded-xl font-bold text-lg transition-all ${
                        tripInput.days === d 
                          ? "gradient-primary text-primary-foreground shadow-glow" 
                          : "bg-muted hover:bg-primary/10"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <Input
                    type="number"
                    value={tripInput.days}
                    onChange={(e) => updateTripInput({ days: Number(e.target.value) })}
                    min={1}
                    max={30}
                    placeholder="Or enter custom days"
                    className="text-lg rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-3 block">Start Date</Label>
                <Input
                  type="date"
                  value={tripInput.startDate}
                  onChange={(e) => updateTripInput({ startDate: e.target.value })}
                  className="text-lg rounded-xl h-14"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-bold">Where to?</h2>
                <p className="text-muted-foreground text-sm">Add one or more destinations</p>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a city (e.g., Paris, Tokyo)"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCity()}
                  className="rounded-xl h-12"
                />
                <Button onClick={addCity} className="rounded-xl gradient-primary h-12 px-6">
                  Add
                </Button>
              </div>
              
              {tripInput.cities && tripInput.cities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tripInput.cities.map((city, i) => (
                    <div 
                      key={city} 
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                    >
                      <span className="text-sm text-muted-foreground">{i + 1}</span>
                      <span className="font-medium text-foreground">{city}</span>
                      <button 
                        onClick={() => removeCity(city)} 
                        className="h-5 w-5 rounded-full hover:bg-destructive/20 flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {tripInput.cities && tripInput.cities.length > 1 && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  AI will optimize the route between cities
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❤️</span>
                </div>
                <h2 className="font-display text-xl font-bold">What do you enjoy?</h2>
                <p className="text-muted-foreground text-sm">Select all that apply</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {PREFERENCES.map(pref => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      tripInput.preferences?.includes(pref.id)
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-2xl block mb-2">{pref.icon}</span>
                    <p className="font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h2 className="font-display text-xl font-bold">Your travel pace</h2>
                <p className="text-muted-foreground text-sm">AI adjusts activities per day</p>
              </div>
              
              <div className="space-y-3">
                {PACE_OPTIONS.map(pace => (
                  <button
                    key={pace.id}
                    onClick={() => updateTripInput({ pace: pace.id })}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                      tripInput.pace === pace.id
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border/50 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{pace.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground">{pace.label}</p>
                        <p className="text-sm text-muted-foreground">{pace.description}</p>
                      </div>
                      {tripInput.pace === pace.id && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={step === 0} 
            className="rounded-xl px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="rounded-xl gradient-primary px-6">
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="rounded-xl gradient-primary shadow-glow px-8">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Itinerary
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planner;
