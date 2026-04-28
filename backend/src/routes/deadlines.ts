import { Router } from "express";
import { Deadline } from "../models/Deadline";
import { AuthRequest, requireAuth } from "../middleware/auth";

export const router = Router();

// GET /api/deadlines?classId=...
router.get("/", async (req, res) => {
  try {
    const { classId } = req.query;
    const query: any = {};

    if (classId) query.classId = classId;

    const deadlines = await Deadline.find(query).sort({ dueAt: 1 });
    res.json(deadlines);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/deadlines (teacher only)
router.post("/", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Teacher role required" });
    }

    const { title, description, classId, subject, dueAt } = req.body;

    const deadline = await Deadline.create({
      title,
      description,
      classId,
      subject,
      dueAt,
      teacherId: user.userId,
    });

    res.status(201).json(deadline);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/deadlines/:id (teacher only)
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Teacher role required" });
    }

    const { title, description, classId, subject, dueAt, status } = req.body;

    const deadline = await Deadline.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        classId,
        subject,
        dueAt,
        status,
      },
      { new: true }
    );

    if (!deadline) {
      return res.status(404).json({ message: "Deadline not found" });
    }

    res.json(deadline);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/deadlines/:id (teacher only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;

    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Teacher role required" });
    }

    const deadline = await Deadline.findByIdAndDelete(req.params.id);

    if (!deadline) {
      return res.status(404).json({ message: "Deadline not found" });
    }

    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});