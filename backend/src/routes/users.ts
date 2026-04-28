import express from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { User } from "../models/User";

const router = express.Router();

router.get("/search", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser || authUser.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can search users" });
    }

    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.json([]);
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const students = await User.find({
      role: "student",
      $or: [{ name: regex }, { email: regex }],
    })
      .select("_id name email role")
      .sort({ name: 1 })
      .limit(10);

    return res.json(
      students.map((student) => ({
        id: String(student._id),
        name: student.name,
        email: student.email,
        role: student.role,
      }))
    );
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to search students" });
  }
});

export { router };