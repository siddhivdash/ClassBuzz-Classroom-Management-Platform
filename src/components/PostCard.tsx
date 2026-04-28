import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Pin, MoreHorizontal } from "lucide-react";
import type { FeedPost } from "@/data/mockData";

const typeStyles: Record<string, string> = {
  announcement: "type-announcement",
  poll: "type-poll",
  doubt: "type-doubt",
  feedback: "type-feedback",
  reminder: "type-reminder",
  recognition: "type-badge",
};

const typeBadgeStyles: Record<string, string> = {
  announcement: "bg-announcement-light text-announcement",
  poll: "bg-poll-light text-poll",
  doubt: "bg-doubt-light text-doubt",
  feedback: "bg-feedback-light text-feedback",
  reminder: "bg-reminder-light text-reminder",
  recognition: "bg-cb-badge-light text-cb-badge",
};

interface PostCardProps {
  post: FeedPost;
  className?: string;
}

const PostCard = ({ post, className }: PostCardProps) => {
  return (
    <div className={cn("bg-card rounded-lg border p-5 card-hover", typeStyles[post.type], className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            {post.author.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-sm">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.isPinned && <Pin className="w-3.5 h-3.5 text-muted-foreground" />}
          <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full capitalize", typeBadgeStyles[post.type])}>
            {post.type}
          </span>
          <button className="p-1 hover:bg-muted rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      <h3 className="font-heading font-semibold mt-3">{post.title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{post.content}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {post.tags.map(tag => (
          <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <Heart className="w-4 h-4" /> {post.likes}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" /> {post.commentsCount}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
