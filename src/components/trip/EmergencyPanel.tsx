import { useState } from "react";
import { Phone, MapPin, Shield, AlertTriangle, Hospital, Flame, Users, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EmergencyNumber {
  service: string;
  number: string;
  icon: React.ReactNode;
}

interface CountryEmergency {
  country: string;
  numbers: EmergencyNumber[];
}

const EMERGENCY_NUMBERS: Record<string, CountryEmergency> = {
  default: {
    country: "International",
    numbers: [
      { service: "Emergency (EU)", number: "112", icon: <Phone className="h-4 w-4" /> },
      { service: "Police", number: "112", icon: <Shield className="h-4 w-4" /> },
      { service: "Ambulance", number: "112", icon: <Hospital className="h-4 w-4" /> },
      { service: "Fire", number: "112", icon: <Flame className="h-4 w-4" /> },
    ]
  },
  US: {
    country: "United States",
    numbers: [
      { service: "Emergency", number: "911", icon: <Phone className="h-4 w-4" /> },
      { service: "Police", number: "911", icon: <Shield className="h-4 w-4" /> },
      { service: "Ambulance", number: "911", icon: <Hospital className="h-4 w-4" /> },
      { service: "Fire", number: "911", icon: <Flame className="h-4 w-4" /> },
    ]
  },
  UK: {
    country: "United Kingdom",
    numbers: [
      { service: "Emergency", number: "999", icon: <Phone className="h-4 w-4" /> },
      { service: "Police", number: "999", icon: <Shield className="h-4 w-4" /> },
      { service: "NHS Direct", number: "111", icon: <Hospital className="h-4 w-4" /> },
      { service: "Fire", number: "999", icon: <Flame className="h-4 w-4" /> },
    ]
  },
  JP: {
    country: "Japan",
    numbers: [
      { service: "Police", number: "110", icon: <Shield className="h-4 w-4" /> },
      { service: "Ambulance/Fire", number: "119", icon: <Hospital className="h-4 w-4" /> },
      { service: "Coast Guard", number: "118", icon: <Users className="h-4 w-4" /> },
    ]
  },
  FR: {
    country: "France",
    numbers: [
      { service: "Emergency (EU)", number: "112", icon: <Phone className="h-4 w-4" /> },
      { service: "Police", number: "17", icon: <Shield className="h-4 w-4" /> },
      { service: "Ambulance (SAMU)", number: "15", icon: <Hospital className="h-4 w-4" /> },
      { service: "Fire", number: "18", icon: <Flame className="h-4 w-4" /> },
    ]
  },
  IN: {
    country: "India",
    numbers: [
      { service: "Emergency", number: "112", icon: <Phone className="h-4 w-4" /> },
      { service: "Police", number: "100", icon: <Shield className="h-4 w-4" /> },
      { service: "Ambulance", number: "102", icon: <Hospital className="h-4 w-4" /> },
      { service: "Fire", number: "101", icon: <Flame className="h-4 w-4" /> },
    ]
  },
  AU: {
    country: "Australia",
    numbers: [
      { service: "Emergency", number: "000", icon: <Phone className="h-4 w-4" /> },
      { service: "Police", number: "000", icon: <Shield className="h-4 w-4" /> },
      { service: "Ambulance", number: "000", icon: <Hospital className="h-4 w-4" /> },
      { service: "Non-emergency", number: "131 444", icon: <Users className="h-4 w-4" /> },
    ]
  },
};

interface EmergencyPanelProps {
  city?: string;
  countryCode?: string;
}

const EmergencyPanel = ({ city, countryCode = "default" }: EmergencyPanelProps) => {
  const [isLocating, setIsLocating] = useState(false);
  
  const emergencyData = EMERGENCY_NUMBERS[countryCode] || EMERGENCY_NUMBERS.default;

  const findNearbyHospitals = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://www.google.com/maps/search/hospitals+near+me/@${latitude},${longitude},14z`;
          window.open(mapsUrl, "_blank");
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to city-based search
          const searchQuery = city ? encodeURIComponent(`hospitals near ${city}`) : "hospitals+near+me";
          window.open(`https://www.google.com/maps/search/${searchQuery}`, "_blank");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      const searchQuery = city ? encodeURIComponent(`hospitals near ${city}`) : "hospitals+near+me";
      window.open(`https://www.google.com/maps/search/${searchQuery}`, "_blank");
      setIsLocating(false);
    }
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const shareText = `My current location: https://www.google.com/maps?q=${latitude},${longitude}`;
          
          if (navigator.share) {
            navigator.share({
              title: "My Location",
              text: shareText,
              url: `https://www.google.com/maps?q=${latitude},${longitude}`
            });
          } else {
            navigator.clipboard.writeText(shareText);
            alert("Location copied to clipboard!");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not get your location. Please enable location services.");
        }
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          Emergency & Safety
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Emergency & Safety
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Emergency Numbers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Emergency Numbers</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {emergencyData.country}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {emergencyData.numbers.map((item) => (
                <a
                  key={item.service}
                  href={`tel:${item.number}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.service}</p>
                    <p className="text-lg font-bold text-destructive">{item.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Find Hospitals */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Nearby Hospitals</h3>
            <Button
              onClick={findNearbyHospitals}
              disabled={isLocating}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {isLocating ? (
                <>
                  <Navigation className="h-4 w-4 animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Find Hospitals Near Me
                  <ExternalLink className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Opens Google Maps with nearby hospitals
            </p>
          </div>

          {/* Share Location */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Share Your Location</h3>
            <Button
              onClick={shareLocation}
              variant="outline"
              className="w-full rounded-xl gap-2"
            >
              <Navigation className="h-4 w-4" />
              Share Live Location
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Share your GPS location with emergency contacts
            </p>
          </div>

          {/* Safety Tips */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h4 className="text-sm font-semibold text-primary mb-2">Stay Safe</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Keep emergency contacts saved offline</li>
              <li>• Share your itinerary with family/friends</li>
              <li>• Have travel insurance documents accessible</li>
              <li>• Know your embassy/consulate location</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyPanel;
