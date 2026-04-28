import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: "student" | "teacher";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.header("Authorization");
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as AuthRequest).user = decoded;
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
