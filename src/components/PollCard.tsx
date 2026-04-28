import { cn } from "@/lib/utils";
import type { Poll } from "@/data/mockData";

interface PollCardProps {
  poll: Poll;
  className?: string;
}

const PollCard = ({ poll, className }: PollCardProps) => {
  return (
    <div className={cn("bg-card rounded-lg border p-5 type-poll card-hover", className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-poll-light text-poll">Poll</span>
        <span className="text-xs text-muted-foreground">
          Expires {new Date(poll.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <h3 className="font-heading font-semibold">{poll.question}</h3>
      <div className="mt-4 space-y-2.5">
        {poll.options.map(option => {
          const pct = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
          return (
            <button key={option.id} className="w-full relative rounded-lg border p-3 text-left hover:border-poll transition-colors group overflow-hidden">
              <div className="absolute inset-0 bg-poll/10 rounded-lg transition-all" style={{ width: `${pct}%` }} />
              <div className="relative flex justify-between items-center">
                <span className="text-sm font-medium">{option.text}</span>
                <span className="text-sm font-semibold text-poll">{pct}%</span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">{poll.totalVotes} votes · {poll.isMultiChoice ? 'Multiple choice' : 'Single choice'}</p>
    </div>
  );
};

export default PollCard;
