
import express from "express"
import { protect, adminOnly } from "../middlewares/authMiddlewares.js"
import { getDashboardData,getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist
 } from "../controllers/taskControllers.js";
const taskRouter = express.Router();

// Task Management Routes
taskRouter.get("/dashboard-data", protect, getDashboardData);

taskRouter.get("/user-dashboard-data", protect, getUserDashboardData);

taskRouter.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned) 

taskRouter.get("/:id", protect, getTaskById); // Get task by ID

taskRouter.post("/", protect, adminOnly, createTask); // Create a task (Admin only)

 taskRouter.put("/:id", protect, updateTask); // Update task details

taskRouter.delete("/:id", protect, adminOnly, deleteTask); // Delete a task (Admin only)

taskRouter.put("/:id/status", protect, updateTaskStatus); // Update task status 

taskRouter.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

export default taskRouter;