import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfidenceMeterProps {
  confidence: number;
  riskFlags?: string[];
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const ConfidenceMeter = ({ confidence, riskFlags = [], size = "md", showLabel = true }: ConfidenceMeterProps) => {
  const getConfidenceColor = () => {
    if (confidence >= 80) return "text-success";
    if (confidence >= 60) return "text-primary";
    if (confidence >= 40) return "text-warning";
    return "text-destructive";
  };

  const getConfidenceGradient = () => {
    if (confidence >= 80) return "from-success/20 to-success/5";
    if (confidence >= 60) return "from-primary/20 to-primary/5";
    if (confidence >= 40) return "from-warning/20 to-warning/5";
    return "from-destructive/20 to-destructive/5";
  };

  const getConfidenceBarColor = () => {
    if (confidence >= 80) return "bg-success";
    if (confidence >= 60) return "bg-primary";
    if (confidence >= 40) return "bg-warning";
    return "bg-destructive";
  };

  const getLabel = () => {
    if (confidence >= 85) return "Very High";
    if (confidence >= 70) return "High";
    if (confidence >= 50) return "Moderate";
    if (confidence >= 30) return "Low";
    return "Very Low";
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div className={`rounded-xl bg-gradient-to-r ${getConfidenceGradient()} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {confidence >= 70 ? (
            <Sparkles className={`h-4 w-4 ${getConfidenceColor()}`} />
          ) : confidence >= 40 ? (
            <CheckCircle2 className={`h-4 w-4 ${getConfidenceColor()}`} />
          ) : (
            <AlertTriangle className={`h-4 w-4 ${getConfidenceColor()}`} />
          )}
          {showLabel && (
            <span className="text-sm font-medium text-foreground">AI Confidence</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${getConfidenceColor()}`}>{confidence}%</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            confidence >= 70 ? "bg-success/20 text-success" : 
            confidence >= 40 ? "bg-warning/20 text-warning" : 
            "bg-destructive/20 text-destructive"
          }`}>
            {getLabel()}
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className={`w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`h-full ${getConfidenceBarColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${confidence}%` }}
        />
      </div>

      {/* Risk flags */}
      {riskFlags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {riskFlags.map((flag, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-warning/10 text-warning border border-warning/20 cursor-help">
                  <AlertTriangle className="h-3 w-3" />
                  {flag}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>This factor may affect the plan reliability</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfidenceMeter;
