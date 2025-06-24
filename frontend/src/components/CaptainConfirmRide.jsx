import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CaptainConfirmRide = ({ setridePopUp, setconfirmRide }) => {
  
  const [OTP, setOTP] = useState('')
  
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          setconfirmRide(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to start
      </h3>
      <div className="border-b-2 ">
        <div className="flex items-center justify-between p-3 bg-yellow-300 rounded-lg mt-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              className="h-12 rounded-full object-cover w-12"
              src="https://th.bing.com/th/id/OIP._ABagscIv6THcS0vD8XczQHaE8?w=272&h=181&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3"
              alt=""
            />
            <h2 className="text-lg font-medium">Amit Singh</h2>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">Rs200</h3>
            <h5 className="text-sm text-gray-600 font-medium">2.2 KM</h5>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5 flex">
          <div className="mb-4 ml-2 w-1/2 break-words">
            <h4 className="text-gray-600 text-sm font-semibold">PICK UP</h4>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm -mt-1 text-gray-600">
              Kirloskar Laoyout, Bangalore, 260090
            </p>
          </div>
          <div className="mb-4 mr-2 w-1/2 text-right break-words">
            <h4 className="text-gray-600 text-sm font-semibold">DROP OFF</h4>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm -mt-1 text-gray-600">
              Kirloskar Layout Banglore
            </p>
          </div>
        </div>
        <div className=" w-full">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              type="text"
              className="bg-[#eee] px-6 py-2 font-mono text-lg rounded-lg w-full mt-3"
              placeholder="Enter OTP"
              onChange={(e)=>{
                   setOTP(e.target.value)
              }}
            />
          </form>
          <div className="flex items-center justify-between w-full mt-5">
            <button
              className="bg-yellow-300 font-semibold p-3 px-10 rounded-lg"
              onClick={() => {
                navigate("/captain-Riding");
              }}
            >
              Confirm
            </button>

            <button
              className="bg-gray-300 font-semibold p-3 px-10 rounded-lg"
              onClick={() => {
                setridePopUp(false), setconfirmRide(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainConfirmRide;
