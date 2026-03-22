import { useState } from "react";
import { Cloud, Sun, CloudRain, Snowflake, Wind, AlertTriangle, RefreshCw, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DayWeather {
  date: string;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "windy";
  tempHigh: number;
  tempLow: number;
  precipitation: number;
  warning?: string;
}

interface WeatherPanelProps {
  city: string;
  days: DayWeather[];
  onReplanDay?: (dayIndex: number, reason: string) => void;
}

const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <Sun className="h-5 w-5 text-yellow-500" />,
  cloudy: <Cloud className="h-5 w-5 text-gray-400" />,
  rainy: <CloudRain className="h-5 w-5 text-blue-500" />,
  stormy: <CloudRain className="h-5 w-5 text-purple-600" />,
  snowy: <Snowflake className="h-5 w-5 text-blue-300" />,
  windy: <Wind className="h-5 w-5 text-teal-500" />,
};

const weatherLabels: Record<string, string> = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  stormy: "Stormy",
  snowy: "Snowy",
  windy: "Windy",
};

const WeatherPanel = ({ city, days, onReplanDay }: WeatherPanelProps) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const hasWeatherWarning = days.some(d => d.warning || d.condition === "stormy" || (d.condition === "rainy" && d.precipitation > 70));

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Thermometer className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">Weather Forecast</h4>
            <p className="text-xs text-muted-foreground">{city}</p>
          </div>
        </div>
        {hasWeatherWarning && (
          <div className="flex items-center gap-1 text-warning text-xs bg-warning/10 px-2 py-1 rounded-full">
            <AlertTriangle className="h-3 w-3" />
            Alert
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {days.map((day, index) => {
          const isExpanded = expandedDay === index;
          const hasIssue = day.warning || day.condition === "stormy" || (day.condition === "rainy" && day.precipitation > 70);

          return (
            <div
              key={day.date}
              className={`rounded-xl p-3 transition-all cursor-pointer ${
                hasIssue ? "bg-warning/5 border border-warning/20" : "bg-muted/30 hover:bg-muted/50"
              }`}
              onClick={() => setExpandedDay(isExpanded ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                    {weatherIcons[day.condition]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Day {index + 1}</p>
                    <p className="text-xs text-muted-foreground">{day.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {day.tempHigh}° / {day.tempLow}°
                  </p>
                  <p className="text-xs text-muted-foreground">{weatherLabels[day.condition]}</p>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Precipitation</span>
                    <span className="text-foreground">{day.precipitation}%</span>
                  </div>
                  
                  {day.warning && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-warning/10">
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <p className="text-xs text-warning">{day.warning}</p>
                    </div>
                  )}

                  {hasIssue && onReplanDay && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full rounded-lg gap-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReplanDay(index, `Weather: ${weatherLabels[day.condition]}`);
                          }}
                        >
                          <RefreshCw className="h-3 w-3" />
                          Ask AI to Adjust This Day
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI will replan indoor activities for this day</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Weather data is indicative. Check local forecasts before traveling.
      </p>
    </div>
  );
};

export default WeatherPanel;
