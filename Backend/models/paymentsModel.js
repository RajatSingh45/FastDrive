import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
     orderId: {
      type: String,
      required: true,   
    },
    paymentId: {
      type: String,   
    },
    signature: {
      type: String,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
    },

    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
},
{ timestamps: true }
)

const paymentModel=mongoose.model("Payment",paymentSchema)

export default paymentModel