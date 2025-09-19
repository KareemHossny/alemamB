const jwt = require("jsonwebtoken");

const UserAuth = (req, res, next) => {
  try {
    const token = req.cookies.token; // التوكن من الكوكي

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.USER_EMAIL) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    req.user = { email: decoded.email };
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = UserAuth;
