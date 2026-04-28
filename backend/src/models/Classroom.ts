import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClassroom extends Document {
  name: string;
  subject: string;
  section: string;
  description?: string;
  teacherId: mongoose.Types.ObjectId;
  classCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassroomSchema = new Schema<IClassroom>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    classCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

type ClassroomModel = Model<IClassroom>;

export const Classroom =
  (mongoose.models.Classroom as ClassroomModel) ||
  mongoose.model<IClassroom>("Classroom", ClassroomSchema);