import React, { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import CaptainNewRide from "../components/CaptainNewRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CaptainConfirmRide from "../components/CaptainConfirmRide";
import { socketContext } from "../contexts/SocketContext";
import axios from 'axios'
import LiveTracking from "../components/LiveTrackingMap";
import { HomeMap } from "../components/HomeMap";
import CaptainLiveTracking from "../components/captainLiveTracking";


const CaptainHome = () => {
  
  // States
  const [ridePopUp, setridePopUp] = useState(false);
  const [confirmRide, setconfirmRide] = useState(false)
  const [newRide,setNewRide]=useState(null)
  const [currLocation, setCurrLocation] = useState(null)
  const [pickupCoords,setPickupCoords]=useState(null)
  const [dropCoords,setDropCoords]=useState(null)

  // useRefs
  const ridePopUpRef = useRef(null);
  const confirmRideRef=useRef(null)

  //useContexts
  const {socket}=useContext(socketContext)

  //emiting join event to join socket
  useEffect(() => {
    const captain=JSON.parse(localStorage.getItem('captain'));

    if(captain){
      // console.log("Emitting join")
      socket.emit("join",{userId:captain._id,userType:"captain"})

      // Send location every 10 seconds
      const sendLocation = () => {
        navigator.geolocation.getCurrentPosition(   //a browser api that lets you access user's device location
          (position) => {
            
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrLocation(location)
            socket.emit("update-captain-loc", {
              userId: captain._id,
              location,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      };
   
      sendLocation(); 
      const intervalId = setInterval(sendLocation, 10000); // Every 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [socket])
  
  // provide new-ride data to cpatin whenever avilable
  socket.on("new-ride",(data)=>{
    // console.log("new ride data for captain:",data);
    // console.log("drop coords:",data.dropCoords)
    // console.log("pickup coords:",data.pickupCoords)
    setridePopUp(true);
     
    setNewRide(data.User)
    setPickupCoords(data.pickupCoords)
    setDropCoords(data.dropCoords)
  });
  
  // console.log("set dropcpprds :", dropCoords);
  //confirm th ride
  const confirmRideHandler=async ()=>{
    try {
      const captain=JSON.parse(localStorage.getItem('captain'));
      console.log("captain in  forntend:",captain)
      const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,{
        rideId:newRide._id,
        captainId:captain._id,
      },
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    setconfirmRide(true);
    setridePopUp(false)
    } catch (error) {
      console.log("error during confirming the ride:",error);
    }
  }
  
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
      <div className={`${confirmRide ? "h-screen" : "h-[65%]"} w-full relative z-0`}>
       {confirmRide ? <CaptainLiveTracking currLocation={currLocation} destination={pickupCoords}/>:<HomeMap/>}
      </div>

      <div className="h-3/5 p-6">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopUpRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12 translate-y-full"
      >
        <CaptainNewRide setridePopUp={setridePopUp}  setconfirmRide={setconfirmRide} ride={newRide} confirmRideHandler={confirmRideHandler}/>
      </div>

       <div
        ref={confirmRideRef}
        className="fixed w-full h-[50%] z-10 bottom-0 bg-white px-3 py-10 pt-12 translate-y-full"
      >
        <CaptainConfirmRide setridePopUp={setridePopUp} setconfirmRide={setconfirmRide} ride={newRide} currLocation={currLocation} dropCoords={dropCoords}/>
      </div>

    </div>
  );
};

export default CaptainHome;
