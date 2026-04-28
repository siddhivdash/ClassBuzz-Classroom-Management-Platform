import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Plus, ThumbsUp, MessageCircle, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

type BackendDoubtStatus = "pending" | "inProgress" | "resolved";

type BackendReply = {
  _id?: string;
  userId: string;
  userName: string;
  role: "teacher" | "student";
  message: string;
  createdAt: string;
};

type BackendDoubt = {
  _id: string;
  classId?: string;
  title: string;
  description: string;
  subject: string;
  status: BackendDoubtStatus;
  upvotes: number;
  createdBy: string;
  createdByName: string;
  createdByRole: "teacher" | "student";
  replies: BackendReply[];
  createdAt: string;
  updatedAt: string;
};

type UiDoubtStatus = "open" | "in-progress" | "resolved";

type DoubtItem = {
  id: string;
  title: string;
  description: string;
  status: UiDoubtStatus;
  category: string;
  priority: "low" | "medium" | "high";
  upvotes: number;
  repliesCount: number;
  author: { name: string; role: "teacher" | "student" };
  replies: BackendReply[];
};

const statusColumns = [
  { key: "open" as const, label: "Pending", color: "bg-doubt" },
  { key: "in-progress" as const, label: "In Progress", color: "bg-feedback" },
  { key: "resolved" as const, label: "Resolved", color: "bg-cb-badge" },
];

const DoubtsPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [showAsk, setShowAsk] = useState(false);
  const [doubts, setDoubts] = useState<DoubtItem[]>([]);
  const [expandedDoubt, setExpandedDoubt] = useState<DoubtItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDetails, setQuestionDetails] = useState("");
  const [questionCategory, setQuestionCategory] = useState("General");
  const [questionPriority, setQuestionPriority] = useState<"low" | "medium" | "high">("medium");
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const mapStatus = (status: BackendDoubtStatus): UiDoubtStatus => {
    if (status === "pending") return "open";
    if (status === "inProgress") return "in-progress";
    return "resolved";
  };

  const mapDoubt = (d: BackendDoubt): DoubtItem => ({
    id: d._id,
    title: d.title,
    description: d.description,
    status: mapStatus(d.status),
    category: d.subject || "General",
    priority: "medium",
    upvotes: d.upvotes ?? 0,
    repliesCount: d.replies?.length ?? 0,
    author: {
      name: d.createdByName || "Student",
      role: d.createdByRole,
    },
    replies: d.replies ?? [],
  });

  const loadDoubts = async () => {
    try {
      setLoading(true);
      const data = await apiGet<BackendDoubt[]>("/doubts");
      const mapped = data.map(mapDoubt);
      setDoubts(mapped);
    } catch (err) {
      console.error("Failed to load doubts", err);
      setDoubts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoubts();
  }, []);

  const groupedDoubts = useMemo(
    () =>
      statusColumns.map((col) => ({
        ...col,
        doubts: doubts.filter((d) => d.status === col.key),
      })),
    [doubts]
  );

  const handleAskDoubt = async () => {
    if (!questionTitle.trim() || !questionDetails.trim() || !questionCategory.trim()) {
      return;
    }

    try {
      setSubmitting(true);

      await apiPost("/doubts", {
        title: questionTitle.trim(),
        description: questionDetails.trim(),
        subject: questionCategory.trim(),
      });

      setQuestionTitle("");
      setQuestionDetails("");
      setQuestionCategory("General");
      setQuestionPriority("medium");
      setShowAsk(false);

      await loadDoubts();
    } catch (err) {
      console.error("Failed to create doubt", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDoubt = (doubt: DoubtItem) => {
    setExpandedDoubt(doubt);
    setReplyText("");
  };

  const handleReply = async () => {
    if (!expandedDoubt || !replyText.trim()) return;

    try {
      setSubmitting(true);

      const updated = await apiPost<BackendDoubt>(`/doubts/${expandedDoubt.id}/replies`, {
        message: replyText.trim(),
      });

      const mapped = mapDoubt(updated);
      setExpandedDoubt(mapped);
      setDoubts((prev) => prev.map((d) => (d.id === mapped.id ? mapped : d)));
      setReplyText("");
    } catch (err) {
      console.error("Failed to send reply", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!expandedDoubt) return;

    try {
      setSubmitting(true);

      const updated = await apiPatch<BackendDoubt>(`/doubts/${expandedDoubt.id}/resolve`, {});
      const mapped = mapDoubt(updated);

      setExpandedDoubt(mapped);
      setDoubts((prev) => prev.map((d) => (d.id === mapped.id ? mapped : d)));
    } catch (err) {
      console.error("Failed to resolve doubt", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (doubtId: string) => {
    try {
      const updated = await apiPatch<BackendDoubt>(`/doubts/${doubtId}/upvote`, {});
      const mapped = mapDoubt(updated);

      setDoubts((prev) => prev.map((d) => (d.id === mapped.id ? mapped : d)));
      if (expandedDoubt?.id === mapped.id) {
        setExpandedDoubt(mapped);
      }
    } catch (err) {
      console.error("Failed to upvote doubt", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Doubts / Q&A</h1>
        {!isTeacher && (
          <Button size="sm" onClick={() => setShowAsk(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Ask a Doubt
          </Button>
        )}
      </div>

      {showAsk && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 z-50"
            onClick={() => setShowAsk(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l z-50 animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-heading font-semibold text-lg">Ask a Doubt</h2>
              <button
                onClick={() => setShowAsk(false)}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question Title</label>
                <input
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter doubt title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Details</label>
                <textarea
                  value={questionDetails}
                  onChange={(e) => setQuestionDetails(e.target.value)}
                  className="w-full h-24 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Describe your doubt in detail..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={questionCategory}
                    onChange={(e) => setQuestionCategory(e.target.value)}
                    className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
                  >
                    <option>General</option>
                    <option>Algorithms</option>
                    <option>Data Structures</option>
                    <option>Systems</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={questionPriority}
                    onChange={(e) =>
                      setQuestionPriority(e.target.value as "low" | "medium" | "high")
                    }
                    className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button className="w-full" onClick={handleAskDoubt} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Doubt"}
              </Button>
            </div>
          </div>
        </>
      )}

      {expandedDoubt && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 z-50"
            onClick={() => setExpandedDoubt(null)}
          />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-card rounded-2xl border shadow-xl z-50 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-heading font-semibold">Doubt Details</h2>
              <button
                onClick={() => setExpandedDoubt(null)}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                    expandedDoubt.status === "open"
                      ? "bg-doubt-light text-doubt"
                      : expandedDoubt.status === "in-progress"
                      ? "bg-feedback-light text-feedback"
                      : "bg-cb-badge-light text-cb-badge"
                  )}
                >
                  {expandedDoubt.status.replace("-", " ")}
                </span>

                <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                  {expandedDoubt.category}
                </span>
              </div>

              <h3 className="font-heading font-semibold text-lg">{expandedDoubt.title}</h3>
              <p className="text-sm text-muted-foreground">{expandedDoubt.description}</p>

              <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" /> {expandedDoubt.upvotes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" /> {expandedDoubt.repliesCount} replies
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpvote(expandedDoubt.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-1.5" />
                  Upvote
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Conversation</p>

                {expandedDoubt.replies.length === 0 ? (
                  <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground">
                    No replies yet
                  </div>
                ) : (
                  expandedDoubt.replies.map((reply, idx) => (
                    <div key={reply._id || idx} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{reply.userName}</span>
                          <span
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide",
                              reply.role === "teacher"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {reply.role}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{reply.message}</p>
                    </div>
                  ))
                )}
              </div>

              {expandedDoubt.status !== "resolved" && (
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full h-20 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder={
                      isTeacher
                        ? "Write your reply..."
                        : "Add a follow-up reply..."
                    }
                  />

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleReply} disabled={submitting}>
                      {submitting ? "Sending..." : "Reply"}
                    </Button>

                    {isTeacher && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-1.5"
                        onClick={handleResolve}
                        disabled={submitting}
                      >
                        <CheckCircle className="w-4 h-4" /> Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {groupedDoubts.map((col) => (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", col.color)} />
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {col.doubts.length}
                </span>
              </div>

              {col.doubts.length === 0 ? (
                <div className="bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed">
                  <p className="text-sm text-muted-foreground">No doubts here</p>
                </div>
              ) : (
                col.doubts.map((doubt, i) => (
                  <motion.div
                    key={doubt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => handleOpenDoubt(doubt)}
                      className="w-full text-left bg-card rounded-xl border p-4 card-hover"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          {doubt.category}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            doubt.priority === "high"
                              ? "text-destructive"
                              : doubt.priority === "medium"
                              ? "text-doubt"
                              : "text-muted-foreground"
                          )}
                        >
                          {doubt.priority}
                        </span>
                      </div>

                      <h4 className="font-semibold text-sm line-clamp-2">{doubt.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {doubt.description}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-semibold text-primary">
                            {doubt.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {doubt.author.name.split(" ")[0]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <ThumbsUp className="w-3 h-3" /> {doubt.upvotes}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <MessageCircle className="w-3 h-3" /> {doubt.repliesCount}
                          </span>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoubtsPage;