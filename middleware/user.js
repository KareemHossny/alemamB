const jwt = require("jsonwebtoken");

const UserAuth = (req, res, next) => {
  try {
    console.log("📩 Incoming cookies:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
      console.log("❌ No token found in request");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    console.log("🔑 Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token payload:", decoded);

    if (decoded.email !== process.env.USER_EMAIL) {
      console.log("⚠️ Email mismatch:", decoded.email, "vs", process.env.USER_EMAIL);
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
