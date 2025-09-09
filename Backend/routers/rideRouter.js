import express from 'express';
import {body,query} from 'express-validator'
import { rideController,fareController, confirmRide, startRide } from '../controller/rideController.js';
import userAuth from "../middleware/userAuth.js";
import captainAuth from '../middleware/captainAuth.js';

const rideRouter=express.Router();

rideRouter.post("/create-ride",userAuth,
    body('pickup').isString().isLength({min:3}).withMessage("Pickup Location must be of length 3"),
    body('drop').isString().isLength({min:3}).withMessage("Drop location must be of length 3"),
    body('veichleType').isString().isIn(['auto','car','motorcycle']).withMessage("Invalid veichleType")
,rideController)

rideRouter.get("/get-fares",userAuth,
    query('pickup').isString().isLength({min:3}).withMessage("Pickup Location must be of length 3"),
    query('drop').isString().isLength({min:3}).withMessage("Drop location must be of length 3"),
    fareController
)

rideRouter.post('/confirm-ride',captainAuth,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    confirmRide
)

rideRouter.post('/start-ride',captainAuth,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    body('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    startRide
)

export default rideRouter;