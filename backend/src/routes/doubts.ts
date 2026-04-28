import { Router } from "express";
import mongoose from "mongoose";
import { Doubt } from "../models/Doubt";
import { AuthRequest, requireAuth } from "../middleware/auth";
import { User } from "../models/User";

export const router = Router();

// GET /api/doubts?classId=...
router.get("/", requireAuth, async (req, res) => {
  try {
    const { classId } = req.query;
    const query: any = {};

    if (classId) query.classId = classId;

    const doubts = await Doubt.find(query).sort({ createdAt: -1 });

    res.json(doubts);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to fetch doubts" });
  }
});

// GET /api/doubts/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json(doubt);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Invalid doubt id" });
  }
});

// POST /api/doubts (student only)
router.post("/", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can post doubts" });
    }

    const { classId, title, description, subject } = req.body;

    if (!title || !description || !subject) {
      return res
        .status(400)
        .json({ message: "title, description and subject are required" });
    }

    const dbUser = await User.findById(user.userId);

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const doubt = await Doubt.create({
      classId:
        classId && mongoose.Types.ObjectId.isValid(classId) ? classId : undefined,
      title,
      description,
      subject,
      createdBy: user.userId,
      createdByName: dbUser.name,
      createdByRole: user.role,
    });

    res.status(201).json(doubt);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to create doubt" });
  }
});

// POST /api/doubts/:id/replies (teacher + student follow-up replies)
router.post("/:id/replies", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const dbUser = await User.findById(user.userId);

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    doubt.replies.push({
      userId: dbUser._id as mongoose.Types.ObjectId,
      userName: dbUser.name,
      role: user.role,
      message: message.trim(),
      createdAt: new Date(),
    });

    if (user.role === "teacher" && doubt.status === "pending") {
      doubt.status = "inProgress";
    }

    await doubt.save();

    res.status(201).json(doubt);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to add reply" });
  }
});

// PATCH /api/doubts/:id/resolve (teacher only)
router.patch("/:id/resolve", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can resolve doubts" });
    }

    const doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json(doubt);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to resolve doubt" });
  }
});

// PATCH /api/doubts/:id/upvote
router.patch("/:id/upvote", requireAuth, async (req, res) => {
  try {
    const doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json(doubt);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to upvote doubt" });
  }
});

// DELETE /api/doubts/:id (owner student or teacher)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    if (
      user.role !== "teacher" &&
      doubt.createdBy.toString() !== user.userId
    ) {
      return res.status(403).json({ message: "Not authorized to delete this doubt" });
    }

    await Doubt.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to delete doubt" });
  }
});