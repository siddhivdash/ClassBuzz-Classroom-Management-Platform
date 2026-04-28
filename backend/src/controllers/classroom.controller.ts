import { Request, Response } from "express";
import { Classroom } from "../models/Classroom";

export const getClassrooms = async (_req: Request, res: Response) => {
  try {
    const classrooms = await Classroom.find().sort({ createdAt: -1 });
    res.status(200).json(classrooms);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const existing = await Classroom.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Class code already exists" });
    }

    // TEMP until auth is connected
    const teacherId = "507f1f77bcf86cd799439011";

    const classroom = await Classroom.create({
      name,
      code,
      teacherId,
      studentIds: [],
    });

    res.status(201).json(classroom);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};