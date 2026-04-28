import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET not set in .env");
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    // SAFETY: check if req.body exists
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { name, email, password, role } = req.body as any;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields: name, email, password, role" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      classes: []
    });

    const plainUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user: plainUser, token });
  } catch (err: any) {
    console.error("Register error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { email, password } = req.body as any;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const plainUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({ user: plainUser, token });
  } catch (err: any) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
});
