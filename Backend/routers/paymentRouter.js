import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { createOrder, verifyPatment } from '../controller/razorpayController.js'
const paymentRouter=express.Router()


paymentRouter.post("/create-order",userAuth,createOrder)
paymentRouter.post("/verify-payment",userAuth,verifyPatment)

export default paymentRouter