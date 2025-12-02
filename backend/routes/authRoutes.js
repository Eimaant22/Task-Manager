import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authControllers.js';
import { protect } from '../middlewares/authMiddlewares.js';
import  upload  from '../middlewares/uploadMiddlewares.js';


const authRouter = Router(); // consistent naming

// Auth Routes
authRouter.post("/register", registerUser);      // Register User
authRouter.post("/login", loginUser);            // Login User
authRouter.get("/profile", protect, getUserProfile);   // Get User Profile
authRouter.put("/profile", protect, updateUserProfile); // Update Profile


authRouter.post("/upload-image", upload.single("image"),(req, res) => { 
    if (req.file) {
return res.status (400).json({ message: "No file uploaded" });
    }
const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

res.status(200).json({imageUrl}); //we have returned the url
})

export default authRouter;
