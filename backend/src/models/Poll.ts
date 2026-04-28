import mongoose, { Schema, Document } from "mongoose";

interface IPollOption {
  text: string;
  votes: mongoose.Types.ObjectId[];
}

export interface IPoll extends Document {
  question: string;
  options: IPollOption[];
  targetClasses: string[];
  expiresAt?: Date;
  isClosed: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

const PollOptionSchema = new Schema<IPollOption>(
  {
    text: { type: String, required: true, trim: true },
    votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: true }
);

const PollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true, trim: true },
    options: {
      type: [PollOptionSchema],
      validate: {
        validator: (opts: IPollOption[]) => opts.length >= 2,
        message: "Poll must have at least 2 options",
      },
    },
    targetClasses: { type: [String], default: [] },
    expiresAt: { type: Date },
    isClosed: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdByName: { type: String, required: true },
  },
  { timestamps: true }
);

export const Poll = mongoose.model<IPoll>("Poll", PollSchema);