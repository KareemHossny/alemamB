const express =require("express")
const userRouter=express.Router()
const usercontroller=require("../controllers/user")
const jwt = require("jsonwebtoken");

userRouter.post('/AlEmam-User',usercontroller.User);

userRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  return res.json({ success: true, message: "Logged out successfully" });
});



userRouter.get("/check", (req, res) => {
    console.log("📩 Cookies received:", req.cookies);
  
    const token = req.cookies.token;
    if (!token) {
      console.log("❌ No token found in cookies");
      return res.json({ isLoggedIn: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded token:");
  
      if (decoded.email === process.env.USER_EMAIL) {
        console.log("🎉 User authenticated successfully");
        return res.json({ isLoggedIn: true });
      }
  
      console.log("⚠️ Email in token does not match USER_EMAIL");
      return res.json({ isLoggedIn: false });
  
    } catch (error) {
      console.error("❌ JWT verification failed:", error.message);
      return res.json({ isLoggedIn: false });
    }
  });
  
module.exports=userRouter;

