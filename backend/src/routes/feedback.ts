import express from "express";
import { Feedback } from "../models/Feedback";
import { User } from "../models/User";
import { AuthRequest, requireAuth } from "../middleware/auth";

const router = express.Router();

const categories = ["Teaching Pace", "Content Clarity", "Engagement", "Other"] as const;

// GET /api/feedback
router.get("/", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (authUser.role === "teacher") {
      const feedback = await Feedback.find().sort({ createdAt: -1 });
      return res.json(feedback);
    }

    const feedback = await Feedback.find({ submittedByRole: "student" }).sort({
      createdAt: -1,
    });

    return res.json(feedback);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to fetch feedback" });
  }
});

// GET /api/feedback/summary
router.get("/summary", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser || authUser.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can access summary" });
    }

    const allFeedback = await Feedback.find().sort({ createdAt: -1 });

    const total = allFeedback.length;
    const averageRating =
      total > 0
        ? allFeedback.reduce((sum, item) => sum + item.rating, 0) / total
        : 0;

    const categoryCounts = categories.map((category) => ({
      name: category,
      value: allFeedback.filter((item) => item.category === category).length,
    }));

    res.json({
      total,
      averageRating: Number(averageRating.toFixed(1)),
      categoryCounts,
      feedback: allFeedback,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to fetch summary" });
  }
});

// POST /api/feedback
router.post("/", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rating, category, comment, classroomId } = req.body;

    if (!rating || !category || !comment) {
      return res.status(400).json({
        message: "Rating, category and comment are required",
      });
    }

    if (!categories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const user = await User.findById(authUser.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (authUser.role !== "student") {
      return res.status(403).json({ message: "Only students can submit feedback" });
    }

    const feedback = await Feedback.create({
      rating: Number(rating),
      category,
      comment: String(comment).trim(),
      submittedBy: user._id,
      submittedByRole: "student",
      classroomId: classroomId || null,
      isAnonymous: true,
    });

    res.status(201).json(feedback);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to submit feedback" });
  }
});

// DELETE /api/feedback/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser || authUser.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can delete feedback" });
    }

    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to delete feedback" });
  }
});

export { router };