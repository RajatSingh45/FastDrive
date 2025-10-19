import { useGSAP } from "@gsap/react";
import React, { useRef, useState } from "react";
import { Link, useLocation} from "react-router-dom";
import FinishRide from "../components/FinishRide";
import gsap from "gsap";
import CaptainLiveTracking from "../components/CaptainLiveTracking";


const CaptainRiding = () => {
  const [finishRidePannel, setFinishRidePannel] = useState(false);
  const finishRidePannelRef = useRef(null);
  const location = useLocation();
  const ride = location.state?.ride;
  const currLocation = location.state?.currLocation;
  const dropCoords=location.state?.dropCoords
  const geometry=location.state?.geometry
  const distance=location.state?.distance

  useGSAP(() => {
    if (finishRidePannel) {
      gsap.to(finishRidePannelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(finishRidePannelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [finishRidePannel]);

  return (
    <div className="h-screen flex flex-col">
  <div className="fixed p-6 top-0 flex items-center justify-between w-full z-50">
    <Link
      to="/captain-login"
      className="fixed right-2 top-2 flex items-center justify-center rounded-full w-10 h-10 bg-white"
    >
      <i className="text-lg font-medium ri-logout-box-r-line"></i>
    </Link>
  </div>

  <div className="absolute top-0 left-0 w-full h-[80%] z-0">
    <CaptainLiveTracking currLocation={currLocation} destination={dropCoords} geometry={geometry}/>
  </div>

  <div className="absolute bottom-0 left-0 w-full flex justify-between p-2 z-40  flex-col">
    <h4 className="text-lg font-semibold mb-5">{distance} Km Away</h4>
    <button
      className="bg-gray-400 font-semibold p-3 px-10 rounded-lg text-black"
      onClick={() => {
       
        setFinishRidePannel(true);
      }}
    >
      Complete Ride
    </button>
  </div>

  <div
    ref={finishRidePannelRef}
    className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
  >
    <FinishRide ride={ride} setFinishRidePannel={setFinishRidePannel} distance={distance}/>
  </div>
</div>

  );
};

export default CaptainRiding;
