import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id, email: user.email, isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

const publicUserData = (user) => {
  return {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
    registeredAt: user.registeredAt
  };
};

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "This email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      isAdmin: normalizedEmail === adminEmail
    });

    const token = createToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: publicUserData(user)
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account is inactive" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user);

    res.json({
      message: "Login successful",
      token,
      user: publicUserData(user)
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;