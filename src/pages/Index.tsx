import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Sparkles, Brain, MapPin, Wallet, Shield, Cloud, ArrowRight, Star, Users, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">SmartTrip AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/planner">
              <Button variant="ghost" className="rounded-xl">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Agentic AI • Real-time Planning</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up leading-tight">
              Plan smarter trips with{" "}
              <span className="relative">
                <span className="text-gradient">AI that thinks</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 3 100 3 150 6C200 9 250 5 298 8" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(173, 58%, 39%)" />
                      <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {" "}like a travel expert
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Our intelligent agent understands your preferences, respects your budget, 
              and creates personalized day-by-day itineraries—explaining every decision along the way.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/planner">
                <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow hover:shadow-lg transition-all duration-300 text-lg px-8 py-6 rounded-2xl group">
                  Start Planning
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-2xl text-lg px-8 py-6">
                See How AI Plans
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-primary-glow/30 border-2 border-background" />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Built for real travelers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Complete Travel Companion
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From planning to booking to safety—SmartTrip AI handles it all
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: Brain, 
                title: "AI That Thinks", 
                description: "Real reasoning, not templates. Plans, validates, and optimizes your trip.",
                gradient: "from-purple-500/20 to-blue-500/20"
              },
              { 
                icon: Wallet, 
                title: "Budget Aware", 
                description: "Set your budget once. The AI ensures every activity fits perfectly.",
                gradient: "from-green-500/20 to-teal-500/20"
              },
              { 
                icon: MapPin, 
                title: "Any Destination", 
                description: "From Paris to Tokyo—itineraries for cities worldwide.",
                gradient: "from-orange-500/20 to-rose-500/20"
              },
              { 
                icon: Cloud, 
                title: "Weather Smart", 
                description: "Adapts your plan automatically based on weather forecasts.",
                gradient: "from-blue-500/20 to-cyan-500/20"
              },
              { 
                icon: Shield, 
                title: "Safety First", 
                description: "Emergency contacts, nearby hospitals, and 24/7 AI health assistance.",
                gradient: "from-red-500/20 to-pink-500/20"
              },
              { 
                icon: Users, 
                title: "Book Everything", 
                description: "Direct links to hotels, flights, and local transport options.",
                gradient: "from-indigo-500/20 to-purple-500/20"
              },
            ].map((feature, i) => (
              <div 
                key={feature.title}
                className="group relative rounded-3xl p-8 bg-card border border-border/50 hover:border-primary/30 hover:shadow-large transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How SmartTrip AI Works
            </h2>
            <p className="text-muted-foreground">Real AI reasoning in every step</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {[
              { step: "1", title: "Tell Us Your Trip", desc: "Budget, dates, destinations, and what you love" },
              { step: "2", title: "AI Plans & Validates", desc: "Our agent creates, checks constraints, and optimizes" },
              { step: "3", title: "Review & Customize", desc: "See AI reasoning, explore alternatives, make it yours" },
              { step: "4", title: "Book & Travel", desc: "Direct booking links, safety features, weather alerts" },
            ].map((item, i) => (
              <div key={item.step} className="flex items-start gap-6 mb-8 last:mb-0">
                <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground shrink-0">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="absolute left-6 h-8 w-0.5 bg-primary/20 mt-14" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 border border-primary/20">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to plan smarter?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let our AI create your perfect itinerary in minutes
            </p>
            <Link to="/planner">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow hover:shadow-lg text-lg px-10 py-6 rounded-2xl">
                Start Planning Now
                <Plane className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">No signup needed • Free to use</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Plane className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">SmartTrip AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Intelligent travel planning powered by advanced AI reasoning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
