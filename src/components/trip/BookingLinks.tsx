import { ExternalLink, Hotel, Plane, Bus, Train, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BookingLinksProps {
  type: "hotel" | "flight" | "transport";
  city: string;
  hotelName?: string;
  dates?: { start: string; end: string };
  destination?: string;
}

const BookingLinks = ({ type, city, hotelName, dates, destination }: BookingLinksProps) => {
  const formatDate = (date: string) => date.replace(/-/g, "");
  
  const generateHotelLinks = () => {
    const encodedCity = encodeURIComponent(city);
    const encodedHotel = hotelName ? encodeURIComponent(hotelName) : encodedCity;
    const checkIn = dates?.start ? formatDate(dates.start) : "";
    const checkOut = dates?.end ? formatDate(dates.end) : "";
    
    return [
      {
        name: "Booking.com",
        url: `https://www.booking.com/searchresults.html?ss=${encodedHotel}&checkin=${checkIn}&checkout=${checkOut}`,
        icon: "🏨",
        color: "bg-blue-600 hover:bg-blue-700"
      },
      {
        name: "Airbnb",
        url: `https://www.airbnb.com/s/${encodedCity}/homes?checkin=${dates?.start}&checkout=${dates?.end}`,
        icon: "🏡",
        color: "bg-rose-500 hover:bg-rose-600"
      },
      {
        name: "Agoda",
        url: `https://www.agoda.com/search?city=${encodedCity}&checkIn=${dates?.start}&checkOut=${dates?.end}`,
        icon: "🌟",
        color: "bg-purple-600 hover:bg-purple-700"
      }
    ];
  };

  const generateFlightLinks = () => {
    const encodedOrigin = encodeURIComponent(city);
    const encodedDest = destination ? encodeURIComponent(destination) : "";
    
    return [
      {
        name: "Google Flights",
        url: `https://www.google.com/travel/flights?q=flights+from+${encodedOrigin}+to+${encodedDest}`,
        icon: <Plane className="h-4 w-4" />,
        color: "bg-blue-500 hover:bg-blue-600"
      },
      {
        name: "Skyscanner",
        url: `https://www.skyscanner.com/transport/flights/${encodedOrigin}/${encodedDest}`,
        icon: "✈️",
        color: "bg-teal-500 hover:bg-teal-600"
      }
    ];
  };

  const generateTransportLinks = () => {
    const encodedCity = encodeURIComponent(city);
    
    return [
      {
        name: "Uber",
        url: `https://m.uber.com/looking?pickup=${encodedCity}`,
        icon: <Car className="h-4 w-4" />,
        color: "bg-black hover:bg-gray-800"
      },
      {
        name: "Train",
        url: `https://www.thetrainline.com/book/results?origin=${encodedCity}`,
        icon: <Train className="h-4 w-4" />,
        color: "bg-orange-500 hover:bg-orange-600"
      },
      {
        name: "Bus",
        url: `https://www.busbud.com/en/search?origin=${encodedCity}`,
        icon: <Bus className="h-4 w-4" />,
        color: "bg-green-600 hover:bg-green-700"
      }
    ];
  };

  const links = type === "hotel" ? generateHotelLinks() : 
                type === "flight" ? generateFlightLinks() : 
                generateTransportLinks();

  const titles = {
    hotel: { icon: <Hotel className="h-5 w-5" />, text: "Book Accommodation" },
    flight: { icon: <Plane className="h-5 w-5" />, text: "Book Flights" },
    transport: { icon: <Car className="h-5 w-5" />, text: "Local Transport" }
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground">
          {titles[type].icon}
        </div>
        <h4 className="font-medium text-foreground">{titles[type].text}</h4>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Tooltip key={link.name}>
            <TooltipTrigger asChild>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="sm"
                  className={`${link.color} text-white rounded-lg text-xs gap-1.5`}
                >
                  {typeof link.icon === "string" ? <span>{link.icon}</span> : link.icon}
                  {link.name}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open {link.name} in new tab</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        AI suggests this based on your budget and location preferences
      </p>
    </div>
  );
};

export default BookingLinks;
