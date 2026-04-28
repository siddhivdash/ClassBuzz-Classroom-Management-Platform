import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "student" | "teacher";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  classes: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher"], required: true },
    classes: [{ type: Schema.Types.ObjectId, ref: "Classroom" }]
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
