import React from "react";

const ChooseVeichleOption = (props) => {
  return (
    <div>
      <h2 className="mb-5 font-semibold text-2xl">Choose your ride</h2>
      <div
        onClick={() => {
          console.log("veichle selection clicked!")
          props.setConfirmVeichle(true),
            props.setveichleSelection(false);
        }}
        className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between "
      >
        <img
          className="h-10 mb-6"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt=""
        />
        <div className=" w-1/2">
          <h4 className="font-medium text-sm">
            FastDriveGo{" "}
            <span>
              <i className="ri-user-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-medium text-xs ">Affordable, compact rides</p>
        </div>
        <h2 className="text-xl font-semibold pb-9">rs200.00</h2>
      </div>
      <div
        onClick={() => {
          props.setConfirmVeichle(true),
            props.setveichleSelection(false);
        }}
        className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between "
      >
        <img
          className="h-10 mb-6"
          src="https://static.vecteezy.com/system/resources/previews/028/051/292/original/electric-motorbike-electric-bike-electric-vehicle-transparent-background-ai-generated-png.png"
          alt=""
        />
        <div className=" w-1/2">
          <h4 className="font-medium text-sm">
            FastDriveGo{" "}
            <span>
              <i className="ri-user-fill"></i>1
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-medium text-xs ">Affordable, compact rides</p>
        </div>
        <h2 className="text-xl font-semibold pb-9">rs200.00</h2>
      </div>
      <div
        onClick={() => {
          props.setConfirmVeichle(true),
            props.setveichleSelection(false);
        }}
        className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between "
      >
        <img
          className="h-10 mb-6"
          src="https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png"
          alt=""
        />
        <div className=" w-1/2">
          <h4 className="font-medium text-sm">
            FastDriveGo{" "}
            <span>
              <i className="ri-user-fill"></i>3
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-medium text-xs ">Affordable, compact rides</p>
        </div>
        <h2 className="text-xl font-semibold pb-9">rs200.00</h2>
      </div>
    </div>
  );
};

export default ChooseVeichleOption;
