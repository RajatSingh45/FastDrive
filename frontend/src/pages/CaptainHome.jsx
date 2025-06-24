import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import CaptainNewRide from "../components/CaptainNewRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CaptainConfirmRide from "../components/CaptainConfirmRide";
const CaptainHome = () => {
  // States
  const [ridePopUp, setridePopUp] = useState(true);
  const [confirmRide, setconfirmRide] = useState(false)

  // useRefs
  const ridePopUpRef = useRef(null);
  const confirmRideRef=useRef(null)

  // GSAP animation code
  useGSAP(() => {
    if (ridePopUp) {
      gsap.to(ridePopUpRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(ridePopUpRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [ridePopUp]);

    useGSAP(() => {
    if (confirmRide) {
      gsap.to(confirmRideRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRideRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRide]);
  return (
    <div className="h-screen">
      <div className="fixed p-3 top-0 flex items-center justify-between w-full">
        <img
          className="w-16 absolute left-5 top-5"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt="uber logo"
        />
        <Link
          to="/captain-login"
          className="fixed right-2 top-2 flex items-center justify-center rounded-full w-10 h-10 bg-white"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-2/5">
        <img
          className="h-full w-full object-cover"
          src="https://th.bing.com/th/id/OIP._0rSU5b1l_1q_2CNBBvuSQHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2"
          alt=""
        />
      </div>

      <div className="h-3/5 p-6">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopUpRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12 translate-y-full"
      >
        <CaptainNewRide setridePopUp={setridePopUp}  setconfirmRide={setconfirmRide}/>
      </div>

       <div
        ref={confirmRideRef}
        className="fixed w-full h-screen z-10 bottom-0 bg-white px-3 py-10 pt-12 translate-y-full"
      >
        <CaptainConfirmRide setridePopUp={setridePopUp} setconfirmRide={setconfirmRide}/>
      </div>

    </div>
  );
};

export default CaptainHome;
