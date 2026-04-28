import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type BackendDeadlineStatus = "upcoming" | "dueSoon" | "overdue";
type UiDeadlineStatus = "upcoming" | "due-today" | "overdue";

type Classroom = {
  _id: string;
  name: string;
  code: string;
};

type BackendDeadline = {
  _id: string;
  title: string;
  description?: string;
  classId: string;
  subject: string;
  dueAt: string;
  status: BackendDeadlineStatus;
  teacherId?: string;
};

type DeadlineItem = {
  id: string;
  title: string;
  description: string;
  className: string;
  dueDate: string;
  status: UiDeadlineStatus;
};

const DeadlinesPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [view, setView] = useState<"list" | "calendar">("list");
  const [showForm, setShowForm] = useState(false);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [subject, setSubject] = useState("");

  const mapStatus = (status: BackendDeadlineStatus): UiDeadlineStatus => {
    if (status === "overdue") return "overdue";
    if (status === "dueSoon") return "due-today";
    return "upcoming";
  };

  const loadDeadlines = async () => {
    const data = await apiGet<BackendDeadline[]>("/deadlines");
    const mapped: DeadlineItem[] = data.map((d) => ({
      id: d._id,
      title: d.title,
      description: d.description || "",
      className: d.classId || d.subject || "Class",
      dueDate: d.dueAt,
      status: mapStatus(d.status),
    }));
    setDeadlines(mapped);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [deadlineData, classroomData] = await Promise.all([
          apiGet<BackendDeadline[]>("/deadlines"),
          apiGet<Classroom[]>("/classrooms"),
        ]);

        const mapped: DeadlineItem[] = deadlineData.map((d) => ({
          id: d._id,
          title: d.title,
          description: d.description || "",
          className: d.classId || d.subject || "Class",
          dueDate: d.dueAt,
          status: mapStatus(d.status),
        }));

        setDeadlines(mapped);
        setClassrooms(classroomData);
      } catch (err) {
        console.error("Failed to load deadlines/classrooms", err);
        setDeadlines([]);
        setClassrooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sorted = [...deadlines].sort((a, b) => {
    const order: Record<UiDeadlineStatus, number> = {
      overdue: 0,
      "due-today": 1,
      upcoming: 2,
    };
    return (order[a.status] ?? 2) - (order[b.status] ?? 2);
  });

  const getCountdownColor = (status: UiDeadlineStatus) => {
    if (status === "overdue") return "bg-destructive/10 text-destructive";
    if (status === "due-today") return "bg-doubt-light text-doubt";
    return "bg-cb-badge-light text-cb-badge";
  };

  const getCountdownText = (dueDate: string, status: UiDeadlineStatus) => {
    if (status === "overdue") return "Overdue";

    const now = new Date();
    const due = new Date(dueDate);
    const hoursLeft = Math.max(
      0,
      Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60))
    );

    if (hoursLeft < 24) return `${hoursLeft}h left`;

    const daysLeft = Math.floor(hoursLeft / 24);
    return `${daysLeft}d left`;
  };

  const handleCreateDeadline = async () => {
    if (!title.trim() || !subject.trim() || !dueDate || !dueTime || !selectedClassId) {
      return;
    }

    try {
      setSubmitting(true);

      const dueAt = new Date(`${dueDate}T${dueTime}`).toISOString();

      await apiPost("/deadlines", {
        title: title.trim(),
        description: description.trim(),
        classId: selectedClassId,
        subject: subject.trim(),
        dueAt,
      });

      await loadDeadlines();

      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("");
      setSelectedClassId("");
      setSubject("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create deadline", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Deadlines</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                view === "list" ? "bg-card shadow-sm" : "text-muted-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("calendar")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                view === "calendar" ? "bg-card shadow-sm" : "text-muted-foreground"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          {isTeacher && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> New Deadline
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 z-50"
            onClick={() => setShowForm(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-heading font-semibold text-lg">New Deadline</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Assignment title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full h-24 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Time</label>
                  <Input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <select
                  className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  <option value="">Select a class</option>
                  {classrooms.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Computer Science"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-t">
              <Button
                className="w-full"
                onClick={handleCreateDeadline}
                disabled={
                  submitting ||
                  !title.trim() ||
                  !subject.trim() ||
                  !dueDate ||
                  !dueTime ||
                  !selectedClassId
                }
              >
                {submitting ? "Creating..." : "Create Deadline"}
              </Button>
            </div>
          </motion.div>
        </>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : view === "list" ? (
        <div className="space-y-3">
          {sorted.length === 0 && (
            <p className="text-sm text-muted-foreground">No deadlines yet.</p>
          )}

          {sorted.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="bg-card rounded-xl border p-4 card-hover flex items-center gap-4">
                <div
                  className={cn(
                    "w-1.5 h-12 rounded-full",
                    r.status === "overdue"
                      ? "bg-destructive"
                      : r.status === "due-today"
                      ? "bg-doubt"
                      : "bg-cb-badge"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {r.className}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        getCountdownColor(r.status)
                      )}
                    >
                      {getCountdownText(r.dueDate, r.status)}
                    </span>
                  </div>

                  <h3 className="font-semibold truncate">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.description}
                  </p>
                </div>

                <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(r.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  <br />
                  {new Date(r.dueDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border p-6">
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-xs font-medium text-muted-foreground py-2"
              >
                {d}
              </div>
            ))}

            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 5 + 1;
              const hasDeadline = sorted.some(
                (r) => new Date(r.dueDate).getDate() === day
              );

              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square flex items-center justify-center text-sm rounded-lg",
                    day > 0 && day <= 31
                      ? "hover:bg-muted cursor-pointer"
                      : "text-muted-foreground/30",
                    day === 24 && "bg-primary/10 text-primary font-semibold",
                    hasDeadline && day > 0 && "ring-2 ring-primary/30"
                  )}
                >
                  {day > 0 && day <= 31 ? day : ""}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlinesPage;