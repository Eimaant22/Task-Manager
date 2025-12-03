import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
        
    },

    profileImageUrl: {
        type: String,
        default: null
    },
     role: { type: String, enum: ["admin", "member"], default: "member" }, // ✅ add this

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
