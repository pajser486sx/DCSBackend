import express from "express";
import DailyWord from "../models/DailyWord.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const words = await DailyWord.find().sort({ createdAt: -1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: "Error loading daily words!" });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const trimmedWord = req.body.word?.trim();

    if (!trimmedWord) {
      return res.status(400).json({ message: "Word is required!" });
    }

    const newWord = await DailyWord.create({
      word: trimmedWord
    });

    res.status(201).json(newWord);
  } catch (error) {
    res.status(400).json({ message: "Couldn't create daily word!" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const deletedWord = await DailyWord.findByIdAndDelete(req.params.id);

    if (!deletedWord) {
      return res.status(404).json({ message: "Daily word not found!" });
    }

    res.json({ message: "Daily word deleted" });
  } catch (error) {
    res.status(400).json({ message: "Couldn't delete daily word!" });
  }
});

export default router;