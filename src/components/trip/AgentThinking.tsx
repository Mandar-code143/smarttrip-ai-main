import { useEffect, useState } from "react";
import { Brain, CheckCircle2, RefreshCcw, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AgentStep } from "@/types/trip";

interface AgentThinkingProps {
  loadingStep: string;
  steps?: AgentStep[];
}

const defaultSteps: AgentStep[] = [
  { step: "understand", status: "pending", message: "Understanding your preferences..." },
  { step: "plan", status: "pending", message: "Creating initial itinerary..." },
  { step: "validate", status: "pending", message: "Checking budget & constraints..." },
  { step: "optimize", status: "pending", message: "Optimizing for best experience..." },
  { step: "explain", status: "pending", message: "Generating reasoning..." },
];

const AgentThinking = ({ loadingStep }: AgentThinkingProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [isReplanning, setIsReplanning] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>(defaultSteps);

  useEffect(() => {
    // Simulate agent progression
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          // Update steps status
          setSteps(s => s.map((step, i) => ({
            ...step,
            status: i < prev + 1 ? "complete" : i === prev + 1 ? "active" : "pending"
          })));
          
          // Randomly trigger replanning
          if (prev === 2 && Math.random() > 0.5) {
            setIsReplanning(true);
            setTimeout(() => setIsReplanning(false), 2000);
          }
          
          return prev + 1;
        }
        return prev;
      });
      
      // Update confidence
      setConfidence(prev => Math.min(95, prev + Math.random() * 15));
    }, 1800);

    return () => clearInterval(interval);
  }, [steps.length]);

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main thinking card */}
        <div className="glass rounded-3xl p-8 shadow-large border border-border/50 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary mb-4 animate-thinking">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {isReplanning ? "Re-optimizing Your Trip..." : "Planning Your Perfect Trip..."}
            </h1>
            <p className="text-muted-foreground">{loadingStep || "The AI agent is making real decisions"}</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Confidence meter */}
          <div className="mb-8 p-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">AI Confidence</span>
              </div>
              <span className="text-lg font-bold text-primary">{Math.round(confidence)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full gradient-primary transition-all duration-500 rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {confidence < 50 ? "Exploring options..." : 
               confidence < 75 ? "Finding optimal balance..." : 
               "High confidence in current plan"}
            </p>
          </div>

          {/* Steps timeline */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <StepItem 
                key={step.step} 
                step={step} 
                isActive={index === currentStepIndex}
                isReplanning={isReplanning && step.step === "validate"}
              />
            ))}
          </div>

          {/* Replanning indicator */}
          {isReplanning && (
            <div className="mt-6 p-4 rounded-2xl bg-warning/10 border border-warning/20 animate-scale-in">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <RefreshCcw className="h-5 w-5 text-warning animate-spin" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Change Detected</p>
                  <p className="text-sm text-muted-foreground">AI is re-planning Day 2 & 3 to optimize costs...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visual loop diagram */}
        <div className="mt-6 flex justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <LoopNode label="Plan" active={currentStepIndex === 1} />
          <LoopArrow />
          <LoopNode label="Check" active={currentStepIndex === 2} />
          <LoopArrow />
          <LoopNode label="Replan" active={isReplanning} highlight />
        </div>
      </div>
    </div>
  );
};

interface StepItemProps {
  step: AgentStep;
  isActive: boolean;
  isReplanning?: boolean;
}

const StepItem = ({ step, isActive, isReplanning }: StepItemProps) => {
  const getIcon = () => {
    if (isReplanning) return <RefreshCcw className="h-4 w-4 text-warning animate-spin" />;
    if (step.status === "complete") return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (isActive) return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
      isActive ? "bg-primary/10 border border-primary/20 shadow-soft" : 
      step.status === "complete" ? "bg-success/5" :
      "bg-muted/30"
    }`}>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
        isReplanning ? "bg-warning/20" :
        step.status === "complete" ? "bg-success/20" :
        isActive ? "gradient-primary" :
        "bg-muted"
      }`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className={`font-medium transition-colors ${
          isActive ? "text-foreground" : 
          step.status === "complete" ? "text-foreground" : 
          "text-muted-foreground"
        }`}>
          {step.message}
          {isActive && <span className="animate-pulse ml-1">|</span>}
        </p>
      </div>
      {step.status === "complete" && (
        <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">Done</span>
      )}
    </div>
  );
};

interface LoopNodeProps {
  label: string;
  active?: boolean;
  highlight?: boolean;
}

const LoopNode = ({ label, active, highlight }: LoopNodeProps) => (
  <div className={`h-12 px-5 rounded-xl flex items-center justify-center font-semibold text-sm transition-all ${
    active ? (highlight ? "gradient-secondary text-secondary-foreground" : "gradient-primary text-primary-foreground") : 
    "bg-muted text-muted-foreground"
  } ${active ? "scale-110 shadow-soft" : ""}`}>
    {label}
  </div>
);

const LoopArrow = () => (
  <div className="flex items-center text-muted-foreground">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </div>
);

export default AgentThinking;
