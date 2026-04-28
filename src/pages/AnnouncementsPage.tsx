import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Pin, MessageCircle, Edit, Trash2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type Classroom = {
  _id: string;
  name: string;
  code: string;
};

type Announcement = {
  _id: string;
  title: string;
  body: string;
  classId?: string;
  teacherId?: string;
  pinned?: boolean;
  priority?: "high" | "medium" | "low";
  targetClasses?: string[];
  reactions?: { emoji: string; count: number }[];
  commentsCount?: number;
  createdAt?: string | Date;
};

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filters = isTeacher
    ? ["All", "Pinned", "High Priority"]
    : ["All", "Pinned", "Unread"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [annData, clsData] = await Promise.all([
          apiGet<Announcement[]>("/announcements"),
          apiGet<Classroom[]>("/classrooms"),
        ]);

        setAnnouncements(annData);
        setClassrooms(clsData);
      } catch (err) {
        console.error("Failed to load data", err);
        setAnnouncements([]);
        setClassrooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === "Pinned") return !!a.pinned;
    if (filter === "High Priority") return a.priority === "high";
    return true;
  });

  const handlePostAnnouncement = async () => {
    if (!title.trim() || !content.trim() || !selectedClassId) return;

    try {
      setSubmitting(true);

      const body = {
        title: title.trim(),
        body: content.trim(),
        classId: selectedClassId,
      };

      const created = await apiPost<Announcement>("/announcements", body);
      setAnnouncements((prev) => [created, ...prev]);
      setShowForm(false);
      setTitle("");
      setContent("");
      setSelectedClassId("");
    } catch (err) {
      console.error("Failed to create announcement", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Announcements</h1>
        {isTeacher && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowForm(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 h-full w-96 bg-background border-l shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">New Announcement</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  className="h-12"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your announcement..."
                  rows={5}
                  className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Target Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select a class</option>
                  {classrooms.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t">
              <Button
                className="w-full"
                onClick={handlePostAnnouncement}
                disabled={
                  submitting ||
                  !title.trim() ||
                  !content.trim() ||
                  !selectedClassId
                }
              >
                {submitting ? "Posting..." : "Post Announcement"}
              </Button>
            </div>
          </motion.div>
        </>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading announcements...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No announcements yet.
            {isTeacher && (
              <p className="mt-2">
                <Button
                  variant="link"
                  onClick={() => setShowForm(true)}
                  className="h-auto p-0"
                >
                  Create the first one →
                </Button>
              </p>
            )}
          </div>
        ) : (
          filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group border rounded-xl p-6 hover:shadow-lg transition-all bg-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {announcement.pinned && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </div>
                  )}
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {announcement.classId}
                  </span>
                </div>

                {isTeacher && (
                  <div className="opacity-0 group-hover:opacity-100 transition-all flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(announcement._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {announcement.body}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                <span>
                  Posted{" "}
                  {new Date(
                    announcement.createdAt || Date.now()
                  ).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-3">
                  {announcement.reactions?.map((reaction) => (
                    <span
                      key={reaction.emoji}
                      className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full"
                    >
                      {reaction.emoji}
                      <span>{reaction.count}</span>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{announcement.commentsCount ?? 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;