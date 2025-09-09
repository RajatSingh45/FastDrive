import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import userRouter from "./routers/userRouter.js";
import captainRouter from './routers/captainRouter.js'
import cookieParser from 'cookie-parser'
import db from "./db/db.js";
import mapRouter from "./routers/mapRouter.js";
import rideRouter from "./routers/rideRouter.js";

db();
const app = express();
app.use(cors({
   origin: [
    "http://localhost:5173",
    "https://vrgqtjbz-5173.inc1.devtunnels.ms"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/',(req, res) => {
  res.send("hello");
});

app.use("/users", userRouter);
app.use("/captains",captainRouter);

app.use("/maps",mapRouter);
app.use("/rides",rideRouter)


export default app
