import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const db = async () => {
  //it will just console log DB connected whenever there is connection  established
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("DB connection error:", err);
  });

  await mongoose.connect(process.env.MONGODB_URI);
};

export default db;
