import dotenv from "dotenv"
dotenv.config();
import cors from "cors"
import express from "express"
import userRouter from "./routers/userRouter.js"
import captainRouter from './routers/captainRouter.js'
import cookieParser from 'cookie-parser'
import db from "./db/db.js"
import mapRouter from "./routers/mapRouter.js"
import rideRouter from "./routers/rideRouter.js"
import paymentRouter from "./routers/paymentRouter.js"

db()
const app = express()
const allowedOrigins = [

    "https://fast-drive-three.vercel.app", 
    
    "https://fast-drive-gd5q6rlbp-rajat-singhs-projects-840e3620.vercel.app", 
    
    "https://fastdrive-nz7q.onrender.com", 
    "http://localhost:5173",
    "https://vrgqtjbz-5173.inc1.devtunnels.ms"
];


app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS policy.'));
        }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/',(req, res) => {
  res.send("hello")
})

app.use("/users", userRouter)
app.use("/captains",captainRouter)

app.use("/maps",mapRouter)
app.use("/rides",rideRouter)

app.use("/payments",paymentRouter)


export default app
