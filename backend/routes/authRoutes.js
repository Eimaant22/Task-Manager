import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authControllers.js';
import { protect } from '../middlewares/authMiddlewares.js';
import  upload  from '../middlewares/uploadMiddlewares.js';


// ---- Image storage helper (Cloudinary, with local-folder fallback) ----
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localUploadDir = path.join(__dirname, "..", "uploads");

export const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

// Uploads a multer memory file and returns a public image URL.
export const saveImage = (req, file) => {
  // Production: Cloudinary (permanent, works on any host)
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "task-manager", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result.secure_url))
      );
      stream.end(file.buffer);
    });
  }

  // Local development fallback: save to the uploads/ folder
  fs.mkdirSync(localUploadDir, { recursive: true });
  const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
  fs.writeFileSync(path.join(localUploadDir, filename), file.buffer);
  return Promise.resolve(
    `${req.protocol}://${req.get("host")}/uploads/${filename}`
  );
};

// ------------------------------------------------------------------

const authRouter = Router(); // consistent naming

// Auth Routes
authRouter.post("/register", registerUser);      // Register User
authRouter.post("/login", loginUser);            // Login User
authRouter.get("/profile", protect, getUserProfile);   // Get User Profile
authRouter.put("/profile", protect, updateUserProfile); // Update Profile


authRouter.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const imageUrl = await saveImage(req, req.file);
    res.status(200).json({ imageUrl }); // return the public image url
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});

export default authRouter;