import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BadgeItem } from "@/types/badge";

type Props = {
  badge: BadgeItem;
};

const BadgeCard = ({ badge }: Props) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border p-5 text-center relative transition-all",
        badge.earned ? "shadow-sm" : "opacity-50 grayscale"
      )}
    >
      {!badge.earned && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      <div className="text-4xl mb-3">{badge.icon}</div>
      <h4 className="font-heading font-semibold text-sm">{badge.name}</h4>
      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
      {badge.earned && badge.earnedAt && (
        <p className="text-xs text-muted-foreground mt-2">
          Earned {new Date(badge.earnedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
};

export default BadgeCard;