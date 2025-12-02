
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected",()=>{console.log(
    "MongoDB connected"
      
    )})
    mongoose.connection.on("disconnected",()=>{console.log(
        "MongoDB disconnected"
    )})
    mongoose.connection.on("error",()=>{console.log(
        "Error occured while connecting mongoDB"
    )})
    await mongoose.connect(process.env.MONGO_URI, {});
   
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;
