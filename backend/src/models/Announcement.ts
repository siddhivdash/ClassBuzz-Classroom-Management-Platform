import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  body: string;
  classId: string;                    // ← string now
  teacherId?: mongoose.Types.ObjectId; // ← optional
  pinned: boolean;
  scheduledFor?: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    classId: { type: String, required: true }, // ← String
    teacherId: { type: Schema.Types.ObjectId, ref: "User" }, // ← optional
    pinned: { type: Boolean, default: false },
    scheduledFor: Date
  },
  { timestamps: true }
);

export const Announcement = mongoose.model<IAnnouncement>(
  "Announcement",
  AnnouncementSchema
);
