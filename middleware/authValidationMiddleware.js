const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email and password are required!"
    });
  }

  const trimmedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (trimmedUsername.length < 2) {
    return res.status(400).json({
      message: "The username must be at least 2 characters long!"
    });
  }

  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address!"
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long!"
    });
  }
  req.body.username = trimmedUsername;
  req.body.email = normalizedEmail;
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required!"
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};