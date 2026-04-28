import { Router } from "express";
import mongoose from "mongoose";
import { Poll } from "../models/Poll";
import { User } from "../models/User";
import { AuthRequest, requireAuth } from "../middleware/auth";

export const router = Router();

// GET /api/polls
router.get("/", requireAuth, async (_req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to fetch polls" });
  }
});

// POST /api/polls (teacher only)
router.post("/", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create polls" });
    }

    const { question, options, targetClasses, expiresAt } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message: "Question and at least 2 options are required",
      });
    }

    const cleanOptions = options
      .map((opt: string) => opt.trim())
      .filter(Boolean)
      .map((text: string) => ({ text, votes: [] }));

    if (cleanOptions.length < 2) {
      return res.status(400).json({
        message: "At least 2 non-empty options are required",
      });
    }

    const dbUser = await User.findById(user.userId);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const payload: any = {
      question: question.trim(),
      options: cleanOptions,
      targetClasses: Array.isArray(targetClasses) ? targetClasses : [],
      createdBy: new mongoose.Types.ObjectId(user.userId),
      createdByName: dbUser.name,
    };

    if (expiresAt) {
      payload.expiresAt = new Date(expiresAt);
    }

    const poll = await Poll.create(payload);

    res.status(201).json(poll);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to create poll" });
  }
});

// POST /api/polls/:id/vote (student only, one vote per poll)
router.post("/:id/vote", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can vote" });
    }

    const { optionId } = req.body;
    if (!optionId) {
      return res.status(400).json({ message: "optionId is required" });
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.isClosed) {
      return res.status(400).json({ message: "Poll is closed" });
    }

    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      poll.isClosed = true;
      await poll.save();
      return res.status(400).json({ message: "Poll has expired" });
    }

    const userIdStr = user.userId.toString();

    const hasAlreadyVoted = poll.options.some((option) =>
      option.votes.some((voteUserId) => voteUserId.toString() === userIdStr)
    );

    if (hasAlreadyVoted) {
      return res.status(400).json({ message: "You have already voted in this poll" });
    }

    const selectedOption = poll.options.find(
      (option: any) => option._id.toString() === optionId
    );

    if (!selectedOption) {
      return res.status(404).json({ message: "Option not found" });
    }

    selectedOption.votes.push(new mongoose.Types.ObjectId(user.userId));
    await poll.save();

    res.json(poll);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to vote" });
  }
});

// PATCH /api/polls/:id/close (teacher only)
router.patch("/:id/close", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can close polls" });
    }

    const poll = await Poll.findByIdAndUpdate(
      req.params.id,
      { isClosed: true },
      { new: true }
    );

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.json(poll);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to close poll" });
  }
});

// DELETE /api/polls/:id (teacher only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can delete polls" });
    }

    const poll = await Poll.findByIdAndDelete(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to delete poll" });
  }
});