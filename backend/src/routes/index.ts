import express from "express";
import { router as announcementRoutes } from "./announcements";
import { router as authRoutes } from "./auth";
import { router as deadlineRoutes } from "./deadlines";
import { router as doubtRoutes } from "./doubts";
import { router as classroomRoutes } from "./classrooms";
import { router as pollsRouter } from "./polls";
import { router as resourcesRouter } from "./resources";
import { router as feedbackRouter } from "./feedback";
import { router as badgesRouter } from "./badges";
import { router as usersRouter } from "./users";

const router = express.Router();

router.use("/announcements", announcementRoutes);
router.use("/auth", authRoutes);
router.use("/deadlines", deadlineRoutes);
router.use("/doubts", doubtRoutes);
router.use("/classrooms", classroomRoutes);
router.use("/polls", pollsRouter);
router.use("/resources", resourcesRouter);
router.use("/feedback", feedbackRouter);
router.use("/badges", badgesRouter);
router.use("/users", usersRouter);

export { router };