import jwt from "jsonwebtoken";
import { User } from "../models/userModels.js";
// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // Extract token
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();

    } else {
      //token not existing
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};




// Middleware for Admin-only access
const adminOnly=(req, res, next) => {
if (req.user && req.user.role === "admin") {
next();
} else {
res.status(403).json({ message: "Access denied, admin only" });
};
}

export{
     protect,
     adminOnly  //exported without using "default",so you have to use {protect} to import in   other files
}