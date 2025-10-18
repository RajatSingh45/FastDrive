import React, { useContext } from "react";
import {RideDataContext} from "../contexts/rideContext";

const ConfirmVeichle = (props) => {
  const {selectedVehical}=useContext(RideDataContext)
  const vehicleImages = {
  car: "https://th.bing.com/th/id/OIP.ymjpxr4RPlwbLenCbbpYywHaE7?rs=1&pid=ImgDetMain",
  moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
  auto: "https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png"
  };
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Confirm Your Ride</h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          src={vehicleImages[selectedVehical]}
          
          alt="veichle"
          className="h-20"
        />
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 border-b-2 mb-3">
            <i className="ri-map-pin-line"></i>
            <div>
              <h1 className="text-base -mt-1 text-gray-600">
                {props.pickup}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-5 border-b-2">
            <i className="ri-map-pin-line"></i>
            <div>
              {/* <h3 className="text-lg font-medium">562/11-A</h3> */}
              <h1 className="text-base -mt-1 text-gray-600">{props.drop}</h1>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h1 className="text-lg font-medium">Rs {props.fares?.[`${selectedVehical}Fare`] ?? "0"}</h1>
            </div>
          </div>
        </div>
        <button 
        onClick={()=>{
          console.log("confirm clicked!")
          props.setConfirmVeichle(false)
          props.setveichleFound(true)
          props.createRide()
        }}
        className="w-full bg-gray-400 font-bold p-2 rounded-lg">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmVeichle;
