import express from "express";
import User from "../models/User.js";
import { supabase } from "../supabase.js";
import { prepareSearch } from "../middleware/searchMiddleware.js";

const router = express.Router();

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const cleanForSupabaseOrSearch = (text) => {
  return text.replace(/[(),]/g, " ").trim();
};

router.get("/", prepareSearch, async (req, res) => {
  try {
    const {
      q,
      page,
      limit,
      skip,
      supabaseFrom,
      supabaseTo
    } = req.search;

    const regex = new RegExp(escapeRegex(q), "i");

    const userQuery = {
      isActive: true,
      $or: [
        { username: regex },
        { email: regex }
      ]
    };

    const usersTotal = await User.countDocuments(userQuery);

    const users = await User.find(userQuery)
      .select("username email registeredAt")
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit);

    const safeQ = cleanForSupabaseOrSearch(q);

    const { data: artworks, error, count: artworksTotal } = await supabase
      .from("artworks")
      .select("*", { count: "exact" })
      .or(
        `title.ilike.%${safeQ}%,uploaded_by.ilike.%${safeQ}%,daily_word.ilike.%${safeQ}%`
      )
      .order("created_at", { ascending: false })
      .range(supabaseFrom, supabaseTo);

    if (error) {
      return res.status(500).json({
        message: "Failed to search artworks",
        error: error.message
      });
    }

    const artworksTotalPages = Math.ceil((artworksTotal || 0) / limit);
    const usersTotalPages = Math.ceil(usersTotal / limit);
    const totalPages = Math.max(artworksTotalPages, usersTotalPages);

    res.json({
      query: q,
      page,
      limit,
      artworks: artworks || [],
      users,
      totals: {
        artworks: artworksTotal || 0,
        users: usersTotal
      },
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages
    });
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      message: "Search failed"
    });
  }
});

export default router;