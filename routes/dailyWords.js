import express from "express";
import DailyWord from "../models/DailyWord.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const getUTCDateKey = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const hashString = (text) => {
  let hash = 0;

  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
};

router.get("/today", async (req, res) => {
  try {
    const words = await DailyWord.find().sort({ createdAt: 1 });
    const dateKey = getUTCDateKey();

    if (words.length === 0) {
      return res.json({
        word: "No words found",
        date: dateKey,
        dailyWord: null
      });
    }

    const index = hashString(dateKey) % words.length;
    const selectedWord = words[index];

    res.json({
      _id: selectedWord._id,
      word: selectedWord.word,
      createdAt: selectedWord.createdAt,
      date: dateKey,
      index
    });
  } catch (error) {
    res.status(500).json({ message: "Error loading today's daily word!" });
  }
});


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