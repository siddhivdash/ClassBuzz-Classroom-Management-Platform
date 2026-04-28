import express from "express";
import { Badge } from "../models/Badge";
import { User } from "../models/User";
import { AuthRequest, requireAuth } from "../middleware/auth";

const router = express.Router();

const BADGE_LIBRARY = [
  {
    badgeId: "quick-responder",
    name: "Quick Responder",
    icon: "⚡",
    description: "Answered 10 doubts within 1 hour",
    points: 15,
  },
  {
    badgeId: "streak-7",
    name: "7-Day Streak",
    icon: "🔥",
    description: "Active for 7 consecutive days",
    points: 20,
  },
  {
    badgeId: "top-contributor",
    name: "Top Contributor",
    icon: "⭐",
    description: "Most helpful answers this week",
    points: 25,
  },
  {
    badgeId: "poll-master",
    name: "Poll Master",
    icon: "📊",
    description: "Participated in 20 polls",
    points: 10,
  },
  {
    badgeId: "knowledge-seeker",
    name: "Knowledge Seeker",
    icon: "🎯",
    description: "Asked 50 questions",
    points: 10,
  },
  {
    badgeId: "mentor",
    name: "Mentor",
    icon: "🤝",
    description: "Helped 25 classmates",
    points: 25,
  },
  {
    badgeId: "streak-30",
    name: "30-Day Streak",
    icon: "💎",
    description: "Active for 30 consecutive days",
    points: 40,
  },
  {
    badgeId: "perfect-score",
    name: "Perfect Score",
    icon: "🏆",
    description: "Scored 100% on an exam",
    points: 50,
  },
] as const;

router.get("/", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (authUser.role === "teacher") {
      const users = await User.find().select("_id name role");
      const allBadges = await Badge.find();

      const response = users.map((u) => {
        const earnedBadges = allBadges.filter(
          (b) => String(b.userId) === String(u._id)
        );

        const badges = BADGE_LIBRARY.map((badge) => {
          const earned = earnedBadges.find((b) => b.badgeId === badge.badgeId);

          return {
            id: badge.badgeId,
            badgeId: badge.badgeId,
            name: badge.name,
            icon: badge.icon,
            description: badge.description,
            points: badge.points,
            earned: !!earned,
            earnedAt: earned?.earnedAt || null,
            userId: String(u._id),
          };
        });

        return {
          userId: String(u._id),
          name: u.name,
          role: u.role,
          badges,
        };
      });

      return res.json(response);
    }

    const studentBadges = await Badge.find({ userId: authUser.userId }).sort({
      earnedAt: -1,
    });

    const merged = BADGE_LIBRARY.map((badge) => {
      const earned = studentBadges.find((b) => b.badgeId === badge.badgeId);

      return {
        id: badge.badgeId,
        badgeId: badge.badgeId,
        name: badge.name,
        icon: badge.icon,
        description: badge.description,
        points: badge.points,
        earned: !!earned,
        earnedAt: earned?.earnedAt || null,
        userId: authUser.userId,
      };
    });

    return res.json(merged);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to fetch badges" });
  }
});

router.get("/leaderboard", requireAuth, async (_req, res) => {
  try {
    const users = await User.find().select("_id name role");
    const allBadges = await Badge.find();

    const leaderboard = users
      .map((u) => {
        const userBadges = allBadges.filter(
          (b) => String(b.userId) === String(u._id)
        );

        const points = userBadges.reduce((sum, b) => sum + (b.points || 0), 0);

        return {
          id: String(u._id),
          name: u.name,
          badgeCount: userBadges.length,
          points,
        };
      })
      .sort((a, b) => b.points - a.points || b.badgeCount - a.badgeCount)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return res.json(leaderboard);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to fetch leaderboard" });
  }
});

router.post("/award", requireAuth, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    if (!authUser || authUser.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can award badges" });
    }

    const { userId, badgeId, note } = req.body;

    if (!userId || !badgeId) {
      return res
        .status(400)
        .json({ message: "userId and badgeId are required" });
    }

    const student = await User.findById(userId);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const meta = BADGE_LIBRARY.find((b) => b.badgeId === badgeId);

    if (!meta) {
      return res.status(400).json({ message: "Invalid badge type" });
    }

    const existing = await Badge.findOne({ userId, badgeId });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Student already has this badge" });
    }

    const badge = await Badge.create({
      userId: student._id,
      awardedBy: authUser.userId,
      badgeId: meta.badgeId,
      name: meta.name,
      icon: meta.icon,
      description: meta.description,
      earned: true,
      earnedAt: new Date(),
      points: meta.points,
      note: String(note || "").trim(),
    });

    return res.status(201).json(badge);
  } catch (err: any) {
    if (err?.code === 11000) {
      return res
        .status(400)
        .json({ message: "Badge already awarded to this student" });
    }

    return res
      .status(500)
      .json({ message: err.message || "Failed to award badge" });
  }
});

export { router };