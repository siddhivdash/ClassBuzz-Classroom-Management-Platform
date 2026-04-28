import { cn } from "@/lib/utils";
import { Calendar, AlertTriangle, Clock } from "lucide-react";
import type { Reminder } from "@/data/mockData";

const statusConfig: Record<string, { icon: React.ReactNode; style: string }> = {
  'upcoming': { icon: <Clock className="w-4 h-4" />, style: 'bg-feedback-light text-feedback' },
  'due-today': { icon: <AlertTriangle className="w-4 h-4" />, style: 'bg-doubt-light text-doubt' },
  'overdue': { icon: <AlertTriangle className="w-4 h-4" />, style: 'bg-reminder-light text-reminder' },
};

interface ReminderCardProps {
  reminder: Reminder;
  className?: string;
}

const ReminderCard = ({ reminder, className }: ReminderCardProps) => {
  const config = statusConfig[reminder.status];
  return (
    <div className={cn("bg-card rounded-lg border p-4 type-reminder card-hover", className)}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg mt-0.5", config.style)}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", config.style)}>
              {reminder.status.replace('-', ' ')}
            </span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{reminder.className}</span>
          </div>
          <h4 className="font-medium mt-1.5 truncate">{reminder.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{reminder.description}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(reminder.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
