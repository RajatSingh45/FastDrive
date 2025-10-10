import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { socketContext } from "../contexts/SocketContext";
import LiveTracking from "../components/LiveTrackingMap";
import { userDataContext } from "../contexts/userDataContext";
import axios from "axios";

const Riding = () => {
  const location = useLocation();
  const { ride, dropCoords, geometry, currLocation, pickupCoords } =
    location.state;
  const { socket } = useContext(socketContext);
  const { user } = useContext(userDataContext);
  const navigate=useNavigate()

  const processPayment = async () => {
    try {
      const amount = ride.fare;
      const rideId = ride._id;
      const userId = user._id;

      if (!amount || !rideId || !userId) {
        console.log("required all fields in frontend");
        throw new Error("required all fields in frontend");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payments/create-order`,
        { amount, rideId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("Backend response:", res);

      const orderData = res.data.order; 
      // console.log("order in frontend:", orderData);

      if (!orderData?.id) {
        throw new Error("Order ID not received from backend");
      }

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      // console.log("key:",key)
      const options = {
        key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ride",
        description: "Your ride payment",
        order_id: orderData.id,
        handler: async function (response) {
          console.log("order response:", response);
          if(!response){
            throw new Error ("Responce not recieved to verify the payment!")
          }
          try {
            const verifyPayment = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/payments/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verifyPayment.data.success) {
              alert("✅ Payment successful and verified!");
              navigate("/home")

            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (verifyError) {
            console.error("❌ Error verifying payment:", verifyError);
          }
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Error in creating the  api:",error);
    }
  };

  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed right-2 top-2 flex items-center justify-center rounded-full w-10 h-10 bg-white"
      >
        <i className="text-lg font-medium ri-home-2-line"></i>
      </Link>
      <div className="h-1/2">
        <LiveTracking
          currLocation={currLocation}
          pickupCoords={pickupCoords}
          dropCoords={dropCoords}
          geometry={geometry}
        />
      </div>
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between">
          <img
            src="https://th.bing.com/th/id/OIP.ymjpxr4RPlwbLenCbbpYywHaE7?rs=1&pid=ImgDetMain"
            alt="veichle"
            className="h-12"
          />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.captain?.fullname.firstname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain?.veichle.plate}
            </h4>
            <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-line"></i>
          <div>
            {/* <h3 className="text-lg font-medium">562/11-A</h3> */}
            <p className="text-sm -mt-1 text-gray-600">{ride?.drop}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-3">
          <i className="ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">Rs{ride?.fare}</h3>
          </div>
        </div>
        <button
          className="w-full bg-green-600 font-semibold p-2 rounded-lg"
          onClick={() => {
            processPayment();
          }}
        >
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
