import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller";

const router = express.Router();

// List + Create
router
  .route("/")
  .get(getAnnouncements)
  .post(createAnnouncement);

// Update + Delete
router
  .route("/:id")
  .patch(updateAnnouncement)
  .delete(deleteAnnouncement);

export { router };
