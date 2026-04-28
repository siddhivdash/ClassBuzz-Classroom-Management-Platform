import mongoose, { Schema, Document } from "mongoose";

export type DeadlineStatus = "upcoming" | "dueSoon" | "overdue";

export interface IDeadline extends Document {
  title: string;
  description?: string;
  classId: mongoose.Types.ObjectId;
  subject: string;
  dueAt: Date;
  status: DeadlineStatus;
  teacherId: mongoose.Types.ObjectId;
}

const DeadlineSchema = new Schema<IDeadline>(
  {
    title: { type: String, required: true },
    description: String,
    classId: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
    subject: { type: String, required: true },
    dueAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["upcoming", "dueSoon", "overdue"],
      default: "upcoming",
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Deadline = mongoose.model<IDeadline>("Deadline", DeadlineSchema);