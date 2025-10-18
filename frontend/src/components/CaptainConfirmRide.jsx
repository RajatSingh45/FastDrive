import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainConfirmRide = ({
  setridePopUp,
  setconfirmRide,
  ride,
  currLocation,
  dropCoords,
  geometry,
  distance,
}) => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const captain = JSON.parse(localStorage.getItem("captain"));

//   console.log("dropCoords in confirm ride:",dropCoords)
//   console.log("currLocation in confirm ride;",currLocation)
//   console.log("ridee in confirm ride:",ride)

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          rideId: ride._id,
          otp: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 200) {
        setridePopUp(false);
        setconfirmRide(false);
        navigate("/captain-Riding", {
          state: { ride, currLocation, dropCoords, geometry, distance },
        });
      }
    } catch (error) {
      console.log("ride not started from captain:", error);
    }
  };
  return (
    <div className="fixed bottom left-0 w-full h-[50vh] bg-white rounded-t-2xl shadow-lg p-5 overflow-y-auto z-50">
      {/* <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => {
          setridePopUp(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5> */}
      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to Start
      </h3>
      <div className="flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 rounded-full object-cover w-12"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt=""
          />
          <h2 className="text-xl font-medium capitalize">
            {ride?.user.fullname.firstname}
          </h2>
        </div>
        <h5 className="text-sm font-semibold">{distance} KM</h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <p className="text-base -mt-1 text-gray-600">{ride?.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <p className="text-base -mt-1 text-gray-600">{ride?.drop}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride?.fare} </h3>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <form onSubmit={submitHandler}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="bg-[#eee] placeholder:text-gray-700 px-6 py-4 font-mono text-lg rounded-lg w-full mt-3"
              placeholder="Enter OTP"
            />

            <button className="w-full mt-5 text-lg flex justify-center bg-green-400 text-gray-700 font-semibold p-3 rounded-lg">
              Confirm
            </button>
            <button
              onClick={() => {
                setconfirmRide(false);
                setridePopUp(false);
              }}
              className="w-full mt-2 bg-red-400 text-lg text-white font-semibold p-3 rounded-lg"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaptainConfirmRide;
