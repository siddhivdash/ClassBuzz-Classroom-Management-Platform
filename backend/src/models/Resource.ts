import mongoose, { Document, Schema } from "mongoose";

export type ResourceType = "pdf" | "doc" | "image" | "link" | "file";

export interface IResource extends Document {
  title: string;
  type: ResourceType;
  subject: string;
  fileUrl?: string;
  linkUrl?: string;
  originalFileName?: string;
  size?: number;
  mimeType?: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedByName: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["pdf", "doc", "image", "link", "file"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      default: "",
    },
    linkUrl: {
      type: String,
      default: "",
    },
    originalFileName: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: "",
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploadedByName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Resource = mongoose.model<IResource>("Resource", ResourceSchema);