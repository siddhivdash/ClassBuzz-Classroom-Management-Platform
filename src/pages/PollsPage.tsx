import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { apiGet, apiPatch, apiPost } from "@/lib/api";

type BackendPollOption = {
  _id: string;
  text: string;
  votes: string[];
};

type BackendPoll = {
  _id: string;
  question: string;
  options: BackendPollOption[];
  targetClasses: string[];
  expiresAt?: string;
  isClosed: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
};

type UiPoll = {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
    voterIds: string[];
  }[];
  totalVotes: number;
  targetClasses: string[];
  expiresAt?: string;
  isClosed: boolean;
  createdByName: string;
};

const PollsPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [polls, setPolls] = useState<UiPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [selectedClass, setSelectedClass] = useState("CS 101");
  const [expiresAt, setExpiresAt] = useState("");

  const mapPoll = (poll: BackendPoll): UiPoll => {
    const mappedOptions = poll.options.map((option) => ({
      id: option._id,
      text: option.text,
      votes: option.votes.length,
      voterIds: option.votes,
    }));

    return {
      id: poll._id,
      question: poll.question,
      options: mappedOptions,
      totalVotes: mappedOptions.reduce((sum, opt) => sum + opt.votes, 0),
      targetClasses: poll.targetClasses || [],
      expiresAt: poll.expiresAt,
      isClosed: poll.isClosed,
      createdByName: poll.createdByName,
    };
  };

  const loadPolls = async () => {
    try {
      setLoading(true);
      const data = await apiGet<BackendPoll[]>("/polls");
      setPolls(data.map(mapPoll));
    } catch (err) {
      console.error("Failed to load polls", err);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolls();
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const handleCreatePoll = async () => {
    const cleanedOptions = options.map((o) => o.trim()).filter(Boolean);

    if (!question.trim() || cleanedOptions.length < 2) return;

    try {
      setSubmitting(true);

      await apiPost("/polls", {
        question: question.trim(),
        options: cleanedOptions,
        targetClasses: selectedClass ? [selectedClass] : [],
        expiresAt: expiresAt || undefined,
      });

      setQuestion("");
      setOptions(["", "", "", ""]);
      setSelectedClass("CS 101");
      setExpiresAt("");
      setShowForm(false);

      await loadPolls();
    } catch (err) {
      console.error("Failed to create poll", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      const updated = await apiPost<BackendPoll>(`/polls/${pollId}/vote`, { optionId });
      const mapped = mapPoll(updated);

      setPolls((prev) => prev.map((poll) => (poll.id === mapped.id ? mapped : poll)));
    } catch (err) {
      console.error("Failed to vote", err);
    }
  };

  const handleClosePoll = async (pollId: string) => {
    try {
      const updated = await apiPatch<BackendPoll>(`/polls/${pollId}/close`, {});
      const mapped = mapPoll(updated);

      setPolls((prev) => prev.map((poll) => (poll.id === mapped.id ? mapped : poll)));
    } catch (err) {
      console.error("Failed to close poll", err);
    }
  };

  const pollsWithUserVote = useMemo(() => {
    return polls.map((poll) => {
      const selectedOption = poll.options.find((option) =>
        option.voterIds.some((id) => id === user?.id)
      );

      return {
        ...poll,
        selectedOptionId: selectedOption?.id,
      };
    });
  }, [polls, user?.id]);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Polls</h1>
        {isTeacher && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Create Poll
          </Button>
        )}
      </div>

      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 z-50"
            onClick={() => setShowForm(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l z-50 animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-heading font-semibold text-lg">Create Poll</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <Input
                  placeholder="What do you want to ask?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              {options.map((option, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">Option {index + 1}</label>
                  <Input
                    placeholder={`Option ${index + 1}...`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
                  >
                    <option>CS 101</option>
                    <option>MATH 201</option>
                    <option>ENG 102</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expires</label>
                  <Input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button className="w-full" onClick={handleCreatePoll} disabled={submitting}>
                {submitting ? "Creating..." : "Create Poll"}
              </Button>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading polls...</p>
      ) : (
        <div className="space-y-4">
          {pollsWithUserVote.map((poll, pi) => {
            const hasVoted = !!poll.selectedOptionId;

            return (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pi * 0.05 }}
              >
                <div className="bg-card rounded-xl border p-5 type-poll card-hover">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full",
                        poll.isClosed
                          ? "bg-muted text-muted-foreground"
                          : "bg-poll-light text-poll"
                      )}
                    >
                      {poll.isClosed ? "Closed" : "Active"}
                    </span>

                    {poll.expiresAt && (
                      <span className="text-xs text-muted-foreground">
                        Expires{" "}
                        {new Date(poll.expiresAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}

                    {poll.targetClasses.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-heading font-semibold">{poll.question}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created by {poll.createdByName}
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {poll.options.map((option) => {
                      const pct =
                        poll.totalVotes > 0
                          ? Math.round((option.votes / poll.totalVotes) * 100)
                          : 0;

                      const isSelected = poll.selectedOptionId === option.id;

                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            !poll.isClosed &&
                            !hasVoted &&
                            !isTeacher &&
                            handleVote(poll.id, option.id)
                          }
                          className={cn(
                            "w-full relative rounded-xl border p-3 text-left transition-all overflow-hidden",
                            isSelected ? "border-poll ring-1 ring-poll" : "hover:border-poll/50",
                            poll.isClosed || hasVoted || isTeacher
                              ? "cursor-default"
                              : "cursor-pointer"
                          )}
                        >
                          {(hasVoted || poll.isClosed || isTeacher) && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="absolute inset-0 bg-poll/10 rounded-xl"
                            />
                          )}

                          <div className="relative flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                  isSelected ? "border-poll bg-poll" : "border-input"
                                )}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <span className="text-sm font-medium">{option.text}</span>
                            </div>

                            {(hasVoted || poll.isClosed || isTeacher) && (
                              <span className="text-sm font-semibold text-poll">{pct}%</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
                    <p className="text-xs text-muted-foreground">
                      {poll.totalVotes} votes
                    </p>

                    {isTeacher && !poll.isClosed && (
                      <Button size="sm" variant="outline" onClick={() => handleClosePoll(poll.id)}>
                        Close Poll
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {pollsWithUserVote.length === 0 && (
            <div className="bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed">
              <p className="text-sm text-muted-foreground">No polls available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollsPage;