import express from "express"
import { protect, adminOnly } from "../middlewares/authMiddlewares.js"
import { exportTasksReport, exportUsersReport } from "../controllers/reportControllers.js";

const reportRouter = express.Router();

reportRouter.get("/export/tasks", protect, adminOnly, exportTasksReport); // Export all tasks as Excel/PDF
reportRouter.get("/export/users", protect, adminOnly, exportUsersReport); // Export user-task report

export default reportRouter;