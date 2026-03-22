import { useState } from "react";
import { Stethoscope, Send, AlertCircle, MapPin, Loader2, X, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIDoctorProps {
  city?: string;
}

const AIDoctor = ({ city }: AIDoctorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI health assistant. I can help with basic health guidance during your travel. How are you feeling today?

⚠️ **Disclaimer**: I provide general health information only. For medical emergencies, please call emergency services or visit a hospital immediately.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const findNearbyHospitals = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.open(`https://www.google.com/maps/search/hospitals/@${latitude},${longitude},14z`, "_blank");
        },
        () => {
          const searchQuery = city ? encodeURIComponent(`hospitals near ${city}`) : "hospitals+near+me";
          window.open(`https://www.google.com/maps/search/${searchQuery}`, "_blank");
        }
      );
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke("ai-doctor", {
        body: { 
          message: userMessage,
          history: messages.slice(-6),
          city: city
        }
      });

      if (response.error) throw new Error(response.error.message);

      const aiResponse = response.data?.response || "I apologize, I couldn't process that request. If you're experiencing a medical emergency, please seek immediate medical attention.";
      
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error("AI Doctor error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm having trouble connecting right now. If this is urgent, please contact emergency services or visit a nearby hospital."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "I have a headache",
    "Feeling nauseous",
    "I have a fever",
    "Stomach pain"
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full gradient-primary shadow-glow hover:shadow-lg transition-all z-50"
          size="icon"
        >
          <Stethoscope className="h-6 w-6 text-primary-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <SheetTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-foreground">AI Health Assistant</span>
              <p className="text-xs text-muted-foreground font-normal">General health guidance</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Medical Disclaimer */}
        <div className="p-3 mx-4 mt-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-warning">
            This is for informational purposes only. Not a substitute for professional medical advice. For emergencies, call emergency services.
          </p>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-3 border-t flex gap-2 overflow-x-auto">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="rounded-full text-xs whitespace-nowrap"
              onClick={() => {
                setInput(action);
              }}
            >
              {action}
            </Button>
          ))}
        </div>

        {/* Find Hospital Button */}
        <div className="px-4 pb-2">
          <Button
            variant="outline"
            onClick={findNearbyHospitals}
            className="w-full rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50 gap-2"
          >
            <MapPin className="h-4 w-4" />
            Find Nearby Hospital
          </Button>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Describe your symptoms..."
              className="rounded-xl"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="rounded-xl gradient-primary"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIDoctor;
