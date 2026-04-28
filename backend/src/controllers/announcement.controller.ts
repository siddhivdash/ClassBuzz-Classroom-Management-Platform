import { Request, Response } from "express";
import { Announcement } from "../models/Announcement";

export const getAnnouncements = async (_req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    console.log("req.body:", req.body); // debug

    // Fix TypeScript errors: use safe destructuring
    const title = req.body?.title as string;
    const body = req.body?.body as string;
    const classId = req.body?.classId as string;
    const teacherId = req.body?.teacherId as string;

    if (!title || !body || !classId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const announcement = await Announcement.create({
      title,
      body,
      classId,           // must be valid ObjectId string
      teacherId: teacherId || "507f1f77bcf86cd799439011", // fallback for testing
      pinned: false,
    });

    res.status(201).json(announcement);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// ADD THESE TWO FUNCTIONS
export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(announcement);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
