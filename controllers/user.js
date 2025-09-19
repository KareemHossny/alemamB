const jwt = require("jsonwebtoken");

// دالة لإنشاء التوكن
const createToken = (email) => {
  return jwt.sign(
    { email }, 
    process.env.JWT_SECRET
  );
};

exports.User = async (req, res) => {
  try {
    const { email, password } = req.body;

    // مقارنة مع بيانات .env
    if (email === process.env.USER_EMAIL && password === process.env.USER_PASSWORD) {
      const token = createToken(email);

      // تخزين التوكن في HttpOnly Cookie
res.cookie("token", token, {
  httpOnly: true,
  secure: true,  // مهم
  sameSite: "none", 
});



      return res.json({ success: true, message: "Login successful" });
    } 

    return res.status(401).json({ success: false, message: "Invalid user or password" });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
