import { Hotel, Star, MapPin, Clock, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HotelSuggestion {
  name: string;
  tier: "budget" | "mid" | "premium";
  pricePerNight: number;
  rating: number;
  distance: string;
  aiReason: string;
}

interface HotelSuggestionsProps {
  city: string;
  currency: string;
  currencySymbol: string;
  hotels: HotelSuggestion[];
  dates?: { start: string; end: string };
}

const tierColors = {
  budget: "bg-green-500/10 text-green-600 border-green-500/20",
  mid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  premium: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const tierLabels = {
  budget: "Budget-Friendly",
  mid: "Mid-Range",
  premium: "Premium",
};

const HotelSuggestions = ({ city, currencySymbol, hotels, dates }: HotelSuggestionsProps) => {
  const generateBookingLink = (hotelName: string) => {
    const encodedHotel = encodeURIComponent(`${hotelName} ${city}`);
    const checkIn = dates?.start || "";
    const checkOut = dates?.end || "";
    return `https://www.booking.com/searchresults.html?ss=${encodedHotel}&checkin=${checkIn}&checkout=${checkOut}`;
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
          <Hotel className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">AI-Suggested Hotels</h4>
          <p className="text-xs text-muted-foreground">{city}</p>
        </div>
      </div>

      <div className="space-y-3">
        {hotels.map((hotel) => (
          <div
            key={hotel.name}
            className="rounded-xl border border-border/50 bg-background/50 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h5 className="font-medium text-foreground">{hotel.name}</h5>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={tierColors[hotel.tier]}>
                    {tierLabels[hotel.tier]}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs text-foreground">{hotel.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  {currencySymbol}{hotel.pricePerNight}
                </p>
                <p className="text-xs text-muted-foreground">per night</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {hotel.distance}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                from activities
              </span>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 mb-3">
              <Sparkles className="h-3 w-3 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">{hotel.aiReason}</p>
            </div>

            <a
              href={generateBookingLink(hotel.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="w-full rounded-lg gap-2">
                Book Now
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelSuggestions;
