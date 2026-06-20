import express from "express";
import DailyWord from "../models/DailyWord.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const words = await DailyWord.find().sort({ createdAt: -1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: "Error loading daily words" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newWord = await DailyWord.create({
      word: req.body.word
    });

    res.status(201).json(newWord);
  } catch (error) {
    res.status(400).json({ message: "Error creating daily word" });
  }
});

export default router;