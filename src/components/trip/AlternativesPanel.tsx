import { useState } from "react";
import { Activity, ActivityAlternative } from "@/types/trip";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, DollarSign, Star, ArrowRightLeft } from "lucide-react";

interface AlternativesPanelProps {
  activity: Activity;
  currency: string;
  onSelectAlternative?: (activity: Activity, alternative: ActivityAlternative) => void;
}

const AlternativesPanel = ({ activity, currency, onSelectAlternative }: AlternativesPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!activity.alternatives?.length) return null;

  const cheaper = activity.alternatives.find(a => a.type === "cheaper");
  const premium = activity.alternatives.find(a => a.type === "premium");

  return (
    <div className="mt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-muted-foreground hover:text-foreground rounded-xl"
      >
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          <span className="text-xs font-medium">See alternatives</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="mt-2 space-y-2 animate-fade-in">
          {/* Cheaper alternative */}
          {cheaper && (
            <div className="p-3 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-success/20 flex items-center justify-center">
                    <DollarSign className="h-3 w-3 text-success" />
                  </div>
                  <span className="text-xs font-semibold text-success uppercase">Budget Option</span>
                </div>
                <span className="text-sm font-bold text-success">
                  {currency}{cheaper.cost}
                  <span className="text-xs font-normal ml-1">
                    (save {currency}{activity.cost - cheaper.cost})
                  </span>
                </span>
              </div>
              <p className="font-medium text-foreground text-sm">{cheaper.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{cheaper.tradeoff}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 w-full rounded-lg border-success/30 text-success hover:bg-success/10"
                onClick={() => onSelectAlternative?.(activity, cheaper)}
              >
                Switch to this option
              </Button>
            </div>
          )}

          {/* Premium alternative */}
          {premium && (
            <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Star className="h-3 w-3 text-secondary" />
                  </div>
                  <span className="text-xs font-semibold text-secondary uppercase">Premium Option</span>
                </div>
                <span className="text-sm font-bold text-secondary">
                  {currency}{premium.cost}
                  <span className="text-xs font-normal ml-1">
                    (+{currency}{premium.cost - activity.cost})
                  </span>
                </span>
              </div>
              <p className="font-medium text-foreground text-sm">{premium.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{premium.tradeoff}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 w-full rounded-lg border-secondary/30 text-secondary hover:bg-secondary/10"
                onClick={() => onSelectAlternative?.(activity, premium)}
              >
                Upgrade to this option
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlternativesPanel;
