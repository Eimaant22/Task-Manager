import multer from "multer";

// Keep the file in memory; the route then sends it to Cloudinary
// (or to the local uploads/ folder if Cloudinary is not configured).
const storage = multer.memoryStorage();

// File Filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;

  if (allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false);
  }
};

// Multer Setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;