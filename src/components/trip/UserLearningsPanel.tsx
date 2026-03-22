import { UserLearnings } from "@/types/trip";
import { Brain, Lightbulb, Heart, Wallet, Zap } from "lucide-react";

interface UserLearningsPanelProps {
  learnings: UserLearnings;
}

const UserLearningsPanel = ({ learnings }: UserLearningsPanelProps) => {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg gradient-secondary flex items-center justify-center">
          <Brain className="h-4 w-4 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">What the AI Learned About You</h3>
          <p className="text-xs text-muted-foreground">Based on your preferences</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Preferred pace */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Preferred Pace</p>
            <p className="text-xs text-muted-foreground">{learnings.preferredPace}</p>
          </div>
        </div>

        {/* Preferred activities */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
          <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
            <Heart className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Top Interests</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {learnings.preferredActivities.map((activity, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                  {activity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Budget comfort */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
          <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <Wallet className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Budget Comfort Zone</p>
            <p className="text-xs text-muted-foreground">{learnings.budgetComfortZone}</p>
          </div>
        </div>

        {/* AI insights */}
        {learnings.insights.length > 0 && (
          <div className="mt-4 p-3 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI Insights</span>
            </div>
            <ul className="space-y-1">
              {learnings.insights.map((insight, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLearningsPanel;
