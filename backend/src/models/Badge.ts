import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBadge extends Document {
  userId: mongoose.Types.ObjectId;
  awardedBy?: mongoose.Types.ObjectId | null;
  badgeId: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt: Date;
  points: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    awardedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    badgeId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    earned: {
      type: Boolean,
      default: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    points: {
      type: Number,
      default: 10,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

BadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

type BadgeModel = Model<IBadge>;

export const Badge =
  (mongoose.models.Badge as BadgeModel) ||
  mongoose.model<IBadge>("Badge", BadgeSchema);