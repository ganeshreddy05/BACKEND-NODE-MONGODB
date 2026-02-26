import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL;

async function connectDB() {
  try {
    const mongo = await mongoose.connect(MONGO_DB_URL);
    console.log("DB CONNECTION SUCCCESFUL");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
export default connectDB;
