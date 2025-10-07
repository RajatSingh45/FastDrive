import paymentModel from "../models/paymentsModel.js";
import {
  createOrderService,
  verifyPaymentService,
} from "../services/paymentServices.js";

const createOrder = async (req, res) => {
  try {
    const { amount,rideId,userId} = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ message: "amount requitred for creating order" });
    }
    const order = await createOrderService(amount);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      userId:userId,
      rideId,
      status: "pending",
      amount,
    });

    return res.status(200).json({ order, newPayment });
  } catch (error) {
    console.log("Error in creating order:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "All fieslds are required to verify the payment" });
    }

    console.log("All required fields to verify payment:",razorpay_order_id,razorpay_payment_id,razorpay_signature)
    
    const varifiedPayment = await verifyPaymentService(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (varifiedPayment) {
      await paymentModel.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: "sucess",
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Payment varyfied successfuly" });
    } else {
      await paymentModel.findOneAndUpdate(
        {orderId:razorpay_order_id},
        {status:"failed"}
      )

      return res.status(500).json({success:false,message:"Payment verification failed"})
    }
  } catch (error) {
    return res.status(500).json({success:false,error:error.message})
  }
};


export {createOrder,verifyPayment}