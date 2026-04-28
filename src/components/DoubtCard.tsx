import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import type { Doubt } from "@/data/mockData";

const statusStyles: Record<string, string> = {
  'open': 'bg-doubt-light text-doubt',
  'in-progress': 'bg-feedback-light text-feedback',
  'resolved': 'bg-cb-badge-light text-cb-badge',
};

const priorityStyles: Record<string, string> = {
  'low': 'text-muted-foreground',
  'medium': 'text-doubt',
  'high': 'text-reminder',
};

interface DoubtCardProps {
  doubt: Doubt;
  className?: string;
}

const DoubtCard = ({ doubt, className }: DoubtCardProps) => {
  return (
    <div className={cn("bg-card rounded-lg border p-5 type-doubt card-hover", className)}>
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full capitalize", statusStyles[doubt.status])}>
          {doubt.status.replace('-', ' ')}
        </span>
        <span className={cn("text-xs font-medium", priorityStyles[doubt.priority])}>
          {doubt.priority} priority
        </span>
        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{doubt.category}</span>
      </div>
      <h3 className="font-heading font-semibold">{doubt.title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{doubt.description}</p>
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
            {doubt.author.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-xs text-muted-foreground">{doubt.author.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageCircle className="w-3.5 h-3.5" /> {doubt.repliesCount} replies
        </div>
      </div>
    </div>
  );
};

export default DoubtCard;
