import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { Feedback, FeedbackSummary, FeedbackCategory } from "@/types/feedback";

const categories: FeedbackCategory[] = [
  "Teaching Pace",
  "Content Clarity",
  "Engagement",
  "Other",
];

const catColors = ["#7c7ce5", "#6fbf8a", "#f0c24b", "#a26ddc"];

const FeedbackPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [comment, setComment] = useState("");

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedback = async () => {
    try {
      setLoading(true);

      if (isTeacher) {
        const summary = await apiGet<FeedbackSummary>("/feedback/summary");
        setFeedback(summary.feedback);
      } else {
        const data = await apiGet<Feedback[]>("/feedback");
        setFeedback(data);
      }
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [isTeacher]);

  const avgRating = useMemo(() => {
    if (!feedback.length) return "0.0";
    return (
      feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
    ).toFixed(1);
  }, [feedback]);

  const catData = categories.map((cat) => ({
    name: cat,
    value: feedback.filter((f) => f.category === cat).length,
  }));

  const handleSubmit = async () => {
    try {
      if (!rating || !category || !comment.trim()) {
        alert("Please select rating, category and write a comment");
        return;
      }

      setSubmitting(true);

      await apiPost("/feedback", {
        rating,
        category,
        comment: comment.trim(),
      });

      setRating(0);
      setHoverRating(0);
      setCategory("");
      setComment("");

      await fetchFeedback();
      alert("Feedback submitted successfully");
    } catch (err) {
      console.error("Submit failed:", err);
      alert(err instanceof Error ? err.message : "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/feedback/${id}`);
      await fetchFeedback();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err instanceof Error ? err.message : "Failed to delete feedback");
    }
  };

  if (isTeacher) {
    return (
      <div className="space-y-6 animate-fade-in max-w-5xl">
        <h1 className="font-heading text-2xl font-bold">Feedback Analytics</h1>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading feedback...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl border p-6 text-center">
                <p className="text-4xl font-heading font-bold text-primary">{avgRating}</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-4 h-4",
                        s <= Math.round(Number(avgRating))
                          ? "text-accent fill-accent"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Average Rating</p>
              </div>

              <div className="bg-card rounded-xl border p-4 md:col-span-2">
                <h3 className="font-semibold text-sm mb-2">Category Breakdown</h3>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie
                        data={catData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                      >
                        {catData.map((_, i) => (
                          <Cell key={i} fill={catColors[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-2">
                    {catData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: catColors[i] }}
                        />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="font-medium ml-auto">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading font-semibold text-lg">Anonymous Comments</h2>

              {feedback.map((f, i) => (
                <motion.div
                  key={f._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "w-3.5 h-3.5",
                              s <= f.rating ? "text-accent fill-accent" : "text-muted"
                            )}
                          />
                        ))}
                      </div>

                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {f.category}
                      </span>

                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(f._id)}
                        className="ml-2"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <p className="text-sm">{f.comment}</p>
                  </div>
                </motion.div>
              ))}

              {feedback.length === 0 && (
                <div className="bg-card rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No feedback submitted yet
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <h1 className="font-heading text-2xl font-bold">Submit Feedback</h1>

      <div className="bg-card rounded-xl border p-6 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium">How would you rate this class?</p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="p-1 transition-transform hover:scale-110"
                type="button"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors",
                    s <= (hoverRating || rating)
                      ? "text-accent fill-accent"
                      : "text-muted"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
            className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">Select a category...</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Feedback</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-24 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Share your thoughts anonymously..."
          />
        </div>

        <Button className="w-full" disabled={!rating || !category || submitting} onClick={handleSubmit}>
          <Send className="w-4 h-4 mr-1.5" />
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Your feedback is anonymous and helps improve the class.
        </p>
      </div>
    </div>
  );
};

export default FeedbackPage;