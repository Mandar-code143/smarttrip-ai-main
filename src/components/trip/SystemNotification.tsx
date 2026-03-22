import { useState, useEffect } from "react";
import { Bell, Cloud, Shield, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "weather" | "safety" | "update" | "info";
  title: string;
  message: string;
  timestamp: Date;
}

interface SystemNotificationProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  weather: <Cloud className="h-4 w-4" />,
  safety: <Shield className="h-4 w-4" />,
  update: <RefreshCw className="h-4 w-4" />,
  info: <Bell className="h-4 w-4" />,
};

const colorMap = {
  weather: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  safety: "bg-green-500/10 text-green-600 border-green-500/20",
  update: "bg-primary/10 text-primary border-primary/20",
  info: "bg-muted text-muted-foreground border-border",
};

const SystemNotification = ({ notifications, onDismiss }: SystemNotificationProps) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, 3));
  }, [notifications]);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className={cn(
            "rounded-xl p-4 border shadow-lg animate-slide-up backdrop-blur-sm",
            colorMap[notification.type]
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start gap-3">
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", colorMap[notification.type])}>
              {iconMap[notification.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="shrink-0 p-1 hover:bg-background/50 rounded-full transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs mt-1 opacity-80">{notification.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemNotification;
