import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Resource } from "../models/Resource";
import { User } from "../models/User";
import { AuthRequest, requireAuth } from "../middleware/auth";

const router = express.Router();

const uploadsRoot = path.join(process.cwd(), "uploads");
const resourcesDir = path.join(uploadsRoot, "resources");

if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resourcesDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({ storage });

function detectResourceType(
  mimetype: string,
  originalname: string
): "pdf" | "doc" | "image" | "file" {
  const name = originalname.toLowerCase();

  if (mimetype.includes("pdf") || name.endsWith(".pdf")) return "pdf";

  if (
    mimetype.startsWith("image/") ||
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".webp")
  ) {
    return "image";
  }

  if (
    name.endsWith(".doc") ||
    name.endsWith(".docx") ||
    name.endsWith(".ppt") ||
    name.endsWith(".pptx") ||
    name.endsWith(".txt")
  ) {
    return "doc";
  }

  return "file";
}

// GET /api/resources
router.get("/", requireAuth, async (req, res) => {
  try {
    const subject = typeof req.query.subject === "string" ? req.query.subject.trim() : "";
    const query = subject ? { subject } : {};

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to fetch resources" });
  }
});

// POST /api/resources/upload
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser || authUser.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can upload resources" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const subject = String(req.body.subject || "").trim();
    const title = String(req.body.title || "").trim();

    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    const dbUser = await User.findById(authUser.userId);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const resource = await Resource.create({
      title: title || req.file.originalname,
      type: detectResourceType(req.file.mimetype, req.file.originalname),
      subject,
      fileUrl: `/uploads/resources/${req.file.filename}`,
      originalFileName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: dbUser._id,
      uploadedByName: dbUser.name,
    });

    res.status(201).json(resource);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to upload resource" });
  }
});

// POST /api/resources/link
router.post("/link", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser || authUser.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can add links" });
    }

    const title = String(req.body.title || "").trim();
    const subject = String(req.body.subject || "").trim();
    const linkUrl = String(req.body.linkUrl || "").trim();

    if (!title || !subject || !linkUrl) {
      return res.status(400).json({
        message: "Title, subject and linkUrl are required",
      });
    }

    const dbUser = await User.findById(authUser.userId);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const resource = await Resource.create({
      title,
      type: "link",
      subject,
      linkUrl,
      uploadedBy: dbUser._id,
      uploadedByName: dbUser.name,
    });

    res.status(201).json(resource);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to add link resource" });
  }
});

// DELETE /api/resources/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser || authUser.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can delete resources" });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.fileUrl) {
      const relativeFilePath = resource.fileUrl.replace(/^\/+/, "");
      const absoluteFilePath = path.join(process.cwd(), relativeFilePath);

      if (fs.existsSync(absoluteFilePath)) {
        fs.unlinkSync(absoluteFilePath);
      }
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: "Resource deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to delete resource" });
  }
});

export { router };