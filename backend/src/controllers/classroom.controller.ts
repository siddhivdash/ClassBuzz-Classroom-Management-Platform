import { Request, Response } from "express";
import { Classroom } from "../models/Classroom";

export const getClassrooms = async (_req: Request, res: Response) => {
  try {
    const classrooms = await Classroom.find().sort({ createdAt: -1 });
    return res.status(200).json(classrooms);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const existing = await Classroom.findOne({
      classCode: String(code).trim().toUpperCase(),
    });

    if (existing) {
      return res.status(400).json({ message: "Class code already exists" });
    }

    const teacherId = "507f1f77bcf86cd799439011";

    const classroom = await Classroom.create({
      name: String(name).trim(),
      classCode: String(code).trim().toUpperCase(),
      teacherId,
    });

    return res.status(201).json(classroom);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};