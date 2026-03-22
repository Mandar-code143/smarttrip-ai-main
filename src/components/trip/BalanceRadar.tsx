import { BalanceMetrics } from "@/types/trip";
import { TrendingUp, DollarSign, Zap, Heart } from "lucide-react";

interface BalanceRadarProps {
  metrics: BalanceMetrics;
  showDetails?: boolean;
}

const BalanceRadar = ({ metrics, showDetails = true }: BalanceRadarProps) => {
  const metricItems = [
    { key: "cost", label: "Cost Efficiency", value: metrics.cost, icon: DollarSign, color: "text-success", bg: "bg-success/10" },
    { key: "experience", label: "Experience Quality", value: metrics.experience, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { key: "fatigue", label: "Energy Balance", value: 100 - metrics.fatigue, icon: Zap, color: "text-warning", bg: "bg-warning/10" },
    { key: "preferenceMatch", label: "Preference Match", value: metrics.preferenceMatch, icon: Heart, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  // Calculate points for radar chart
  const size = 120;
  const center = size / 2;
  const maxRadius = size / 2 - 10;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 4 - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  };

  const points = [metrics.cost, metrics.experience, 100 - metrics.fatigue, metrics.preferenceMatch]
    .map((value, i) => getPoint(i, value));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Balance Analysis</h3>
          <p className="text-xs text-muted-foreground">How the AI optimized your trip</p>
        </div>
      </div>

      {/* Radar visualization */}
      <div className="flex justify-center mb-4">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background circles */}
          {[25, 50, 75, 100].map((level) => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(level / 100) * maxRadius}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity={0.5}
            />
          ))}
          
          {/* Axes */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
            const x2 = center + Math.cos(angle) * maxRadius;
            const y2 = center + Math.sin(angle) * maxRadius;
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}

          {/* Data polygon */}
          <path
            d={pathD}
            fill="hsl(var(--primary) / 0.2)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--card))"
              strokeWidth="2"
            />
          ))}

          {/* Labels */}
          <text x={center} y="5" textAnchor="middle" className="fill-muted-foreground text-[10px]">Cost</text>
          <text x={size - 5} y={center + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">Experience</text>
          <text x={center} y={size - 2} textAnchor="middle" className="fill-muted-foreground text-[10px]">Energy</text>
          <text x="5" y={center + 4} textAnchor="start" className="fill-muted-foreground text-[10px]">Preferences</text>
        </svg>
      </div>

      {/* Detailed metrics */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-3">
          {metricItems.map((item) => (
            <div key={item.key} className={`rounded-xl p-3 ${item.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${item.color}`}>{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BalanceRadar;
