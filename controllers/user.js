// controllers/user.js
const createToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.User = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.USER_EMAIL && password === process.env.USER_PASSWORD) {
      const token = createToken(email);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
      });

      return res.json({ success: true, message: "Login successful" });
    }

    return res.status(401).json({ success: false, message: "Invalid user or password" });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
