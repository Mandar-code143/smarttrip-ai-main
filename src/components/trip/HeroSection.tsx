import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Brain, RefreshCcw, MessageSquare, Users, MapPin, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-primary/10" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative container mx-auto px-4 pt-24 pb-16">
        {/* Agentic AI Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 shadow-soft">
            <div className="flex items-center gap-1">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Agentic AI</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <span className="text-xs text-muted-foreground">Real-time Planning</span>
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>

        {/* Main headline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Plan smarter trips with{" "}
            <span className="relative inline-block">
              <span className="text-gradient">AI that thinks</span>
              <Sparkles className="absolute -top-2 -right-8 h-6 w-6 text-secondary animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Not just suggestions — real decisions. Our AI agent plans, validates, re-plans, 
            and explains every choice like a travel expert by your side.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link to="/planner">
            <Button size="lg" className="rounded-2xl px-8 py-6 text-lg font-semibold shadow-glow hover:shadow-xl transition-all duration-300 group gradient-primary border-0">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="rounded-2xl px-8 py-6 text-lg font-semibold glass border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all">
            See How the AI Plans
            <Brain className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Agent process preview */}
        <div className="max-w-3xl mx-auto mb-16 animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="glass rounded-3xl p-6 shadow-large border border-border/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">SmartTrip AI Agent</span>
            </div>
            
            <div className="space-y-3">
              <AgentStepPreview icon={Brain} label="Understanding" text="Analyzing preferences: adventure, food, culture..." complete />
              <AgentStepPreview icon={MapPin} label="Planning" text="Creating 5-day itinerary for Tokyo..." complete />
              <AgentStepPreview icon={RefreshCcw} label="Validating" text="Checking budget constraints..." complete />
              <AgentStepPreview icon={RefreshCcw} label="Re-planning" text="Optimizing Day 3 to reduce costs by $45..." active />
              <AgentStepPreview icon={MessageSquare} label="Explaining" text="Generating reasoning..." pending />
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p className="text-sm text-muted-foreground mb-4">Built for real travelers</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <SocialProofItem icon={Users} value="10K+" label="Trips Planned" />
            <SocialProofItem icon={MapPin} value="150+" label="Countries" />
            <SocialProofItem icon={Star} value="4.9" label="Avg Rating" />
          </div>
        </div>
      </div>
    </section>
  );
};

interface AgentStepPreviewProps {
  icon: React.ElementType;
  label: string;
  text: string;
  complete?: boolean;
  active?: boolean;
  pending?: boolean;
}

const AgentStepPreview = ({ icon: Icon, label, text, complete, active, pending }: AgentStepPreviewProps) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
    active ? "bg-primary/10 border border-primary/20" : 
    complete ? "bg-muted/50" : 
    "bg-muted/30 opacity-60"
  }`}>
    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
      active ? "gradient-primary" : 
      complete ? "bg-success/20" : 
      "bg-muted"
    }`}>
      <Icon className={`h-4 w-4 ${
        active ? "text-primary-foreground" : 
        complete ? "text-success" : 
        "text-muted-foreground"
      }`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-sm truncate ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {text}
        {active && <span className="animate-pulse">|</span>}
      </p>
    </div>
    {complete && (
      <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center">
        <svg className="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )}
    {active && (
      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      </div>
    )}
  </div>
);

interface SocialProofItemProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

const SocialProofItem = ({ icon: Icon, value, label }: SocialProofItemProps) => (
  <div className="flex items-center gap-2">
    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="font-display font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default HeroSection;
