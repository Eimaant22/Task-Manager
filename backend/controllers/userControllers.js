import { Task } from "../models/taskModels.js"
import { User } from "../models/userModels.js"



const getUsers=async(req,res)=>{
// @desc Get all users (Admin only)
// @route  GET /api/users/
// @access Private (Admin)
    try {
        const users=await User.find({role:"member"}).select("-password")
        // Add task counts to each user
const usersWithTaskCounts = await Promise.all(
  users.map(async (user) => {
    const pendingTasks = await Task.countDocuments({
      assignedTo: user._id,
      status: "Pending",
    });

    const inProgressTasks = await Task.countDocuments({
      assignedTo: user._id,
      status: "In progress",
    });

    const completedTasks = await Task.countDocuments({
      assignedTo: user._id,
      status: "Completed",
    });

    return {
      ...user._doc, // Combines the original user’s document (user._doc) with the new task count fields.
      pendingTasks,
      inProgressTasks,
      completedTasks,
    };
  })
);
 res.status(200).json(usersWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });    
    }
}

const getUserById=async(req,res)=>{
// @desc Get user by ID
// @route GET /api/users/:id
// @access Private
    try {
        const user=await User.findById(req.params.id).select("-password")
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });    
    }
}




export{
    getUsers,
    getUserById
}





