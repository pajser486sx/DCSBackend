export const prepareSearch = (req, res, next) => {
  const q = req.query.q?.trim();

  if (!q) {
    return res.status(400).json({
      message: "Search query is required!"
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = 12;

  if (page < 1) {
    return res.status(400).json({
      message: "Page must be 1 or higher!"
    });
  }

  const skip = (page - 1) * limit;

  req.search = {
    q,
    page,
    limit,
    skip,
    supabaseFrom: skip,
    supabaseTo: skip + limit - 1
  };

  next();
};