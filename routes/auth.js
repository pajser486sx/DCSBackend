import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRegister, validateLogin } from "../middleware/authValidationMiddleware.js";

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
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
    registeredAt: user.registeredAt
  };
};

router.post("/register", validateRegister, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({ message: "This email has already been registered!" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "This username is already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isAdmin: email === adminEmail
    });

    const token = createToken(user);

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: publicUserData(user)
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed!" });
  }
});


router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select("+password");

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