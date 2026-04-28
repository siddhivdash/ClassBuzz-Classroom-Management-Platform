import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Star, Crown, Search, Award, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import BadgeCard from "@/components/BadgeCard";
import { apiGet, apiPost } from "@/lib/api";
import type {
  BadgeItem,
  LeaderboardEntry,
  StudentSearchResult,
} from "@/types/badge";

const BadgesPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [tab, setTab] = useState<"badges" | "leaderboard">("badges");
  const [showAward, setShowAward] = useState(false);

  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [awardSubmitting, setAwardSubmitting] = useState(false);

  const [studentQuery, setStudentQuery] = useState("");
  const [studentResults, setStudentResults] = useState<StudentSearchResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentSearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [awardBadgeId, setAwardBadgeId] = useState("");
  const [awardNote, setAwardNote] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [badgeData, leaderboardData] = await Promise.all([
        apiGet<BadgeItem[]>("/badges"),
        apiGet<LeaderboardEntry[]>("/badges/leaderboard"),
      ]);

      setBadges(badgeData);
      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error("Failed to fetch badges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const earned = badges.filter((b) => b.earned).length;
    const points = badges
      .filter((b) => b.earned)
      .reduce((sum, b) => sum + b.points, 0);

    return {
      earned,
      streak: 7,
      points,
    };
  }, [badges]);

useEffect(() => {
  const timer = setTimeout(async () => {
    const query = studentQuery.trim();

    if (!showAward || !query) {
      setStudentResults([]);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await apiGet<StudentSearchResult[]>(
        `/users/search?q=${encodeURIComponent(query)}`
      );
      setStudentResults(results);
    } catch (err) {
      console.error("Student search failed:", err);
      setStudentResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [studentQuery, showAward]);

  const resetAwardModal = () => {
    setShowAward(false);
    setStudentQuery("");
    setStudentResults([]);
    setSelectedStudent(null);
    setAwardBadgeId("");
    setAwardNote("");
    setSearchLoading(false);
  };

  const handleAward = async () => {
    try {
      if (!selectedStudent || !awardBadgeId) {
        alert("Please select a student and badge");
        return;
      }

      setAwardSubmitting(true);

      await apiPost("/badges/award", {
        userId: selectedStudent.id,
        badgeId: awardBadgeId,
        note: awardNote,
      });

      resetAwardModal();
      await fetchData();
    } catch (err) {
      console.error("Award failed:", err);
      alert(err instanceof Error ? err.message : "Failed to award badge");
    } finally {
      setAwardSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Badges & Leaderboard</h1>

        {isTeacher && (
          <Button size="sm" onClick={() => setShowAward(true)}>
            <Award className="w-4 h-4 mr-1.5" />
            Award Badge
          </Button>
        )}
      </div>

      {showAward && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 z-50"
            onClick={resetAwardModal}
          />

          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-card rounded-2xl border shadow-xl z-50 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-heading font-semibold">Award Badge</h2>

              <button
                type="button"
                onClick={resetAwardModal}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Student</label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Type student name..."
                    className="pl-9"
                    value={studentQuery}
                    onChange={(e) => {
                      setStudentQuery(e.target.value);
                      setSelectedStudent(null);
                    }}
                  />
                </div>

                {searchLoading && (
                  <div className="text-xs text-muted-foreground px-1">
                    Searching...
                  </div>
                )}

                {!searchLoading &&
                  studentQuery.trim().length > 0 &&
                  selectedStudent === null && (
                    <div className="border rounded-lg bg-background max-h-40 overflow-y-auto">
                      {studentResults.length > 0 ? (
                        studentResults.map((student) => (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => {
                              setSelectedStudent(student);
                              setStudentQuery(student.name);
                              setStudentResults([]);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                          >
                            <div className="text-sm font-medium">
                              {student.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {student.email}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No students found
                        </div>
                      )}
                    </div>
                  )}

                {selectedStudent && (
                  <div className="rounded-md border bg-primary/10 text-primary px-3 py-2 text-sm">
                    Selected student:{" "}
                    <span className="font-medium">{selectedStudent.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Badge Type</label>

                <select
                  className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
                  value={awardBadgeId}
                  onChange={(e) => setAwardBadgeId(e.target.value)}
                >
                  <option value="">Select badge...</option>
                  <option value="quick-responder">⚡ Quick Responder</option>
                  <option value="streak-7">🔥 7-Day Streak</option>
                  <option value="top-contributor">⭐ Top Contributor</option>
                  <option value="poll-master">📊 Poll Master</option>
                  <option value="knowledge-seeker">🎯 Knowledge Seeker</option>
                  <option value="mentor">🤝 Mentor</option>
                  <option value="streak-30">💎 30-Day Streak</option>
                  <option value="perfect-score">🏆 Perfect Score</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Note</label>

                <textarea
                  className="w-full h-20 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Add a personal note..."
                  value={awardNote}
                  onChange={(e) => setAwardNote(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleAward}
                disabled={awardSubmitting}
              >
                {awardSubmitting ? "Awarding..." : "Award Badge"}
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setTab("badges")}
          className={cn(
            "text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors",
            tab === "badges"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          Badges
        </button>

        <button
          onClick={() => setTab("leaderboard")}
          className={cn(
            "text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors",
            tab === "leaderboard"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          Leaderboard
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : tab === "badges" ? (
        <>
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-card rounded-xl border p-4 text-center">
              <Trophy className="w-6 h-6 text-cb-badge mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">{stats.earned}</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </div>

            <div className="bg-card rounded-xl border p-4 text-center">
              <Flame className="w-6 h-6 text-doubt mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">{stats.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>

            <div className="bg-card rounded-xl border p-4 text-center">
              <Star className="w-6 h-6 text-poll mx-auto mb-1" />
              <p className="text-2xl font-heading font-bold">{stats.points}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <BadgeCard badge={badge} />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-lg space-y-2">
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className={cn(
                  "bg-card rounded-xl border p-4 flex items-center gap-4 card-hover",
                  entry.rank <= 3 && "ring-1 ring-accent/30"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    entry.rank === 1
                      ? "bg-accent text-accent-foreground"
                      : entry.rank === 2
                      ? "bg-muted text-muted-foreground"
                      : entry.rank === 3
                      ? "bg-doubt-light text-doubt"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {entry.rank <= 3 ? <Crown className="w-4 h-4" /> : entry.rank}
                </div>

                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {entry.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-sm">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.badgeCount} badges · {entry.points} pts
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgesPage;