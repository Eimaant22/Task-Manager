import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js'; // Add .js if using ES Modules
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Needed behind hosting proxies (Render, Railway, etc.) so https links are correct
app.set("trust proxy", 1);

// Middleware to handle CORS
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
connectDB();

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // fix: express.urlencoded needs to be called

app.get("/"),(req,res)=>{
    res.send("Backend is running")
}
// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);


// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});