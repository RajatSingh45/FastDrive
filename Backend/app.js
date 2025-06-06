import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import userRouter from "./routers/userRouter.js";
import captainRouter from './routers/captainRouter.js'
import cookieParser from 'cookie-parser'
import db from "./db/db.js";

db();
const app = express();
app.use(cors({
   origin: 'http://localhost:5173', // or whatever your frontend origin is
  credentials: true,
}));
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/',(req, res) => {
  res.send("hello");
});

app.use("/users", userRouter);
app.use("/captains",captainRouter);

app.listen(port, () => {
  console.log("App is listening to port 4000!");
});
