import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Link2,
  Image as ImageIcon,
  File,
  Download,
  Upload,
  FolderOpen,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { apiDelete, apiGet, apiPost, apiUpload } from "@/lib/api";
import type { Resource } from "@/types/resource";

const API_FILE_BASE =
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

const typeIcons: Record<string, any> = {
  pdf: FileText,
  link: Link2,
  image: ImageIcon,
  doc: File,
  file: File,
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return "";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

const ResourcesPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSubject, setUploadSubject] = useState("CS101");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [linkTitle, setLinkTitle] = useState("");
  const [linkSubject, setLinkSubject] = useState("CS101");
  const [linkUrl, setLinkUrl] = useState("");

  const [submittingUpload, setSubmittingUpload] = useState(false);
  const [submittingLink, setSubmittingLink] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Resource[]>("/resources");
      setResources(data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const subjects = useMemo(
    () => [...new Set(resources.map((r) => r.subject))],
    [resources]
  );

  const filtered = selectedSubject
    ? resources.filter((r) => r.subject === selectedSubject)
    : [];

  const handleUploadFile = async () => {
    try {
      if (!selectedFile) {
        alert("Please choose a file");
        return;
      }

      if (!uploadSubject.trim()) {
        alert("Please enter a subject");
        return;
      }

      setSubmittingUpload(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("subject", uploadSubject.trim());
      formData.append("title", uploadTitle.trim());

      await apiUpload("/resources/upload", formData);

      setUploadTitle("");
      setUploadSubject("CS101");
      setSelectedFile(null);
      setShowUploadModal(false);

      await fetchResources();
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmittingUpload(false);
    }
  };

  const handleAddLink = async () => {
    try {
      if (!linkTitle.trim() || !linkSubject.trim() || !linkUrl.trim()) {
        alert("Please fill title, subject, and URL");
        return;
      }

      setSubmittingLink(true);

      await apiPost("/resources/link", {
        title: linkTitle.trim(),
        subject: linkSubject.trim(),
        linkUrl: linkUrl.trim(),
      });

      setLinkTitle("");
      setLinkSubject("CS101");
      setLinkUrl("");
      setShowLinkModal(false);

      await fetchResources();
    } catch (err) {
      console.error("Failed to add link:", err);
      alert(err instanceof Error ? err.message : "Failed to add link");
    } finally {
      setSubmittingLink(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/resources/${id}`);
      await fetchResources();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOpenResource = (resource: Resource) => {
    if (resource.type === "link" && resource.linkUrl) {
      window.open(resource.linkUrl, "_blank");
      return;
    }

    if (resource.fileUrl) {
      window.open(`${API_FILE_BASE}${resource.fileUrl}`, "_blank");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Resources</h1>
      </div>

      {isTeacher && (
        <div className="bg-card rounded-xl border border-dashed p-8 text-center space-y-3">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            Share classroom files and useful links with students
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
              Upload File
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowLinkModal(true)}>
              <Link2 className="w-4 h-4 mr-1.5" /> Paste Link
            </Button>
          </div>
        </div>
      )}

      {showUploadModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-heading font-semibold text-lg">Upload Resource</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (optional)</label>
                <Input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Enter resource title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  placeholder="CS101"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Choose File</label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="mt-auto p-4 border-t">
              <Button className="w-full" onClick={handleUploadFile} disabled={submittingUpload}>
                {submittingUpload ? "Uploading..." : "Upload Resource"}
              </Button>
            </div>
          </div>
        </>
      )}

      {showLinkModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setShowLinkModal(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-heading font-semibold text-lg">Add Link Resource</h2>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Enter link title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={linkSubject}
                  onChange={(e) => setLinkSubject(e.target.value)}
                  placeholder="CS101"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mt-auto p-4 border-t">
              <Button className="w-full" onClick={handleAddLink} disabled={submittingLink}>
                {submittingLink ? "Adding..." : "Add Link"}
              </Button>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading resources...</div>
      ) : !selectedSubject ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject, i) => {
            const count = resources.filter((r) => r.subject === subject).length;
            return (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setSelectedSubject(subject)}
                  className="w-full bg-card rounded-xl border p-6 text-left card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-semibold">{subject}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {count} file{count !== 1 ? "s" : ""}
                  </p>
                </button>
              </motion.div>
            );
          })}

          {subjects.length === 0 && (
            <div className="col-span-full bg-card rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No resources available yet
            </div>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={() => setSelectedSubject(null)}
            className="text-sm text-primary font-medium hover:underline"
          >
            ← Back to folders
          </button>

          <h2 className="font-heading font-semibold text-lg">{selectedSubject}</h2>

          <div className="space-y-2">
            {filtered.map((r, i) => {
              const Icon = typeIcons[r.type] || File;

              return (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="bg-card rounded-xl border p-4 flex items-center gap-4 card-hover">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        r.type === "pdf"
                          ? "bg-destructive/10 text-destructive"
                          : r.type === "link"
                          ? "bg-primary/10 text-primary"
                          : r.type === "image"
                          ? "bg-cb-badge-light text-cb-badge"
                          : "bg-feedback-light text-feedback"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString()}{" "}
                        {r.size ? `· ${formatBytes(r.size)}` : ""}
                        {" · "}
                        Uploaded by {r.uploadedByName}
                      </p>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => handleOpenResource(r)}>
                      <Download className="w-4 h-4" />
                    </Button>

                    {isTeacher && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(r._id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-card rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No resources in this folder
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ResourcesPage;