import mongoose, { Schema, Document } from "mongoose";

export type DoubtStatus = "pending" | "inProgress" | "resolved";

interface IDoubtReply {
  userId: mongoose.Types.ObjectId;
  userName: string;
  role: "teacher" | "student";
  message: string;
  createdAt: Date;
}

export interface IDoubt extends Document {
  classId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  subject: string;
  status: DoubtStatus;
  upvotes: number;
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  createdByRole: "teacher" | "student";
  replies: IDoubtReply[];
  createdAt: Date;
  updatedAt: Date;
}

const DoubtReplySchema = new Schema<IDoubtReply>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    role: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const DoubtSchema = new Schema<IDoubt>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Classroom" },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "inProgress", "resolved"],
      default: "pending",
    },
    upvotes: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdByName: { type: String, required: true },
    createdByRole: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },
    replies: { type: [DoubtReplySchema], default: [] },
  },
  { timestamps: true }
);

export const Doubt = mongoose.model<IDoubt>("Doubt", DoubtSchema);