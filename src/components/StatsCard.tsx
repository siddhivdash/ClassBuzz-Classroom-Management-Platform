import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  colorClass?: string;
  className?: string;
}

const StatsCard = ({ title, value, icon, trend, colorClass = "bg-primary/10 text-primary", className }: StatsCardProps) => {
  return (
    <div className={cn("bg-card rounded-lg border p-5 card-hover", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-heading font-bold mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground mt-1.5">{trend}</p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", colorClass)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
