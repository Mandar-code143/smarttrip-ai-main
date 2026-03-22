import { useState } from "react";
import { DayPlan, getCurrencySymbol } from "@/types/trip";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  MapPin, 
  Clock, 
  Zap, 
  Lightbulb,
  Sun,
  Cloud,
  Moon,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import AlternativesPanel from "./AlternativesPanel";
import ConfidenceMeter from "./ConfidenceMeter";

interface DayCardProps {
  day: DayPlan;
  currency: string;
  isExpanded?: boolean;
}

const DayCard = ({ day, currency }: DayCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const currencySymbol = getCurrencySymbol(currency);

  const getTimeIcon = (time: string) => {
    switch (time) {
      case "morning": return Sun;
      case "afternoon": return Cloud;
      case "evening": case "night": return Moon;
      default: return Sun;
    }
  };

  const getFatigueColor = (level: string) => {
    switch (level) {
      case "low": return "bg-success/10 text-success border-success/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "food": return "🍽️";
      case "adventure": return "🎢";
      case "culture": return "🎭";
      case "sightseeing": return "🏛️";
      case "shopping": return "🛍️";
      case "relaxation": return "🧘";
      case "nightlife": return "🎉";
      case "nature": return "🌿";
      default: return "📍";
    }
  };

  // Group activities by time of day
  const groupedActivities = {
    morning: day.activities.filter(a => a.timeOfDay === "morning"),
    afternoon: day.activities.filter(a => a.timeOfDay === "afternoon"),
    evening: day.activities.filter(a => a.timeOfDay === "evening"),
    night: day.activities.filter(a => a.timeOfDay === "night"),
  };

  return (
    <div className="glass rounded-3xl shadow-card overflow-hidden border border-border/50 animate-fade-in">
      {/* Day header */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-6 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-primary-foreground">{day.day}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Day {day.day}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{day.city}</span>
                    <span className="text-muted">•</span>
                    <span className="text-sm">{day.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{currencySymbol}{day.totalCost}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(day.totalDuration / 60)}h planned</p>
                  </div>
                  
                  {/* Fatigue indicator */}
                  <div className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${getFatigueColor(day.fatigueLevel || "medium")}`}>
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-3 w-3" />
                      {day.fatigueLevel || "Medium"} Energy
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Mobile stats */}
            <div className="sm:hidden flex items-center gap-4 mt-3">
              <span className="text-primary font-bold">{currencySymbol}{day.totalCost}</span>
              <span className="text-muted-foreground text-sm">{Math.round(day.totalDuration / 60)}h</span>
              <span className={`px-2 py-0.5 rounded-full border text-xs ${getFatigueColor(day.fatigueLevel || "medium")}`}>
                {day.fatigueLevel || "Medium"}
              </span>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6">
            {/* Day confidence */}
            {day.confidence && (
              <div className="mb-4">
                <ConfidenceMeter 
                  confidence={day.confidence} 
                  riskFlags={day.riskFlags} 
                  size="sm" 
                  showLabel={false} 
                />
              </div>
            )}

            {/* Day explanation */}
            {day.dayExplanation && (
              <div className="mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Why this day looks like this</p>
                    <p className="text-sm text-muted-foreground">{day.dayExplanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-6">
              {Object.entries(groupedActivities).map(([timeOfDay, activities]) => {
                if (activities.length === 0) return null;
                const TimeIcon = getTimeIcon(timeOfDay);
                
                return (
                  <div key={timeOfDay}>
                    <div className="flex items-center gap-2 mb-3">
                      <TimeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {timeOfDay}
                      </span>
                    </div>
                    
                    <div className="space-y-3 pl-6 border-l-2 border-border/50">
                      {activities.map((activity) => (
                        <div 
                          key={activity.id} 
                          className="relative p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          {/* Timeline dot */}
                          <div className="absolute -left-[25px] top-6 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                          
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-2xl shrink-0">
                              {getCategoryEmoji(activity.category)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-semibold text-foreground">{activity.name}</h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {activity.description}
                                  </p>
                                </div>
                                
                                {activity.confidence && (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Sparkles className="h-3 w-3 text-primary" />
                                    <span className="text-xs font-medium text-primary">{activity.confidence}%</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3 w-3" /> {activity.duration}min
                                </span>
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                  activity.energyLevel === "low" ? "bg-success/10 text-success" :
                                  activity.energyLevel === "high" ? "bg-warning/10 text-warning" :
                                  "bg-muted text-muted-foreground"
                                }`}>
                                  <Zap className="h-3 w-3" /> {activity.energyLevel}
                                </span>
                                <span className="font-semibold text-primary">{currencySymbol}{activity.cost}</span>
                              </div>

                              {/* Alternatives panel */}
                              <AlternativesPanel activity={activity} currency={currencySymbol} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DayCard;
