import mongoose, { Schema, Document } from "mongoose";

export type FeedbackCategory =
  | "Teaching Pace"
  | "Content Clarity"
  | "Engagement"
  | "Other";

export interface IFeedback extends Document {
  rating: number;
  category: FeedbackCategory;
  comment: string;
  submittedBy?: mongoose.Types.ObjectId;
  submittedByRole?: "student" | "teacher";
  classroomId?: mongoose.Types.ObjectId;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      enum: ["Teaching Pace", "Content Clarity", "Engagement", "Other"],
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submittedByRole: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      default: null,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);