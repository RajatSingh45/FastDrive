import crypto from "crypto";
import dotenv from "dotenv";
import razorpay from "../config/razorpayInstance.js";
dotenv.config();


const createOrderService = async (amount, currency = "INR") => {
  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    const newOrder = await razorpay.orders.create(options);

    if (!newOrder) {
      throw new Error("Order not created successfully");
    }
    return newOrder;
  } catch (error) {
    console.log("order creation failed");

     if (error.error) {
      console.error("Razorpay API Error:", error.error);
    } else {
      console.error("Error message:", error.message);
    }

    throw new Error(error.message);
  }
};

const verifyPaymentService = async (orderId, paymentId, signature) => {
  try {
    const sign = orderId + "|" + paymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");
    
    if(!expectedSign){
        throw new Error("Payment not verified successfully")
    }
    return expectedSign === signature;
  } catch (error) {
    console.log("payment not verified")
    throw new Error(error.message)
  }
};

export {createOrderService,verifyPaymentService}
