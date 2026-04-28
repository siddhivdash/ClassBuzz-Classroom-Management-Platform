import { X, Check } from "lucide-react";
import { mockNotifications } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsPanel = ({ open, onClose }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!open) return null;

  const today = notifications.filter(n => n.group === 'today');
  const thisWeek = notifications.filter(n => n.group === 'this-week');

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 z-50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l z-50 animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-heading font-semibold text-lg">Notifications</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {[{ label: "Today", items: today }, { label: "This Week", items: thisWeek }].map(group => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group.label}</p>
              <div className="space-y-2">
                {group.items.map(n => (
                  <div key={n.id} className={cn("flex items-start gap-3 p-3 rounded-lg transition-colors", n.read ? "opacity-60" : "bg-primary/5")}>
                    <span className="text-lg mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(n.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
