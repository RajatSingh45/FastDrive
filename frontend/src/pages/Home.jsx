import React, { useRef, useState, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { useNavigate, useLocation } from "react-router-dom";
import SearchPannel from "../components/SearchPannel";
import ChooseVeichleOption from "../components/ChooseVeichleOption";
import ConfirmVeichle from "../components/ConfirmVeichle";
import VeichleFound from "../components/VeichleFound";
import WaitingForDriver from "../components/WaitingForDriver";
import { RideDataContext } from "../contexts/rideContext";
import { userDataContext } from "../contexts/userDataContext";
import { socketContext } from "../contexts/SocketContext";

import { HomeMap } from "../components/HomeMap";

import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTrackingMap";
import { HomeMap } from '../components/HomeMap'
// import ChooseVeichleOption from "../components/ChooseVeichleOption";

const Home = () => {
  //useStates
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pannelOpen, setPannelOpen] = useState(false);
  const [veichleSelection, setveichleSelection] = useState(false);
  const [confirmVeichle, setConfirmVeichle] = useState(false);
  const [veichleFound, setveichleFound] = useState(false);
  const [waitingForDriver, setwaitingForDriver] = useState(false);

  // const [adressPannel, setadressPannel] = useState(true)

  const [activeField, setActiveField] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [fares, setFares] = useState({});
  const [ride, setRide] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  //useNavigate
  const navigate = useNavigate();

  //useEffects
  //emiting join event to join socket
  useEffect(() => {
    // console.log("user in home:-",user)
    if (user && user._id) {
      socket.emit("join", { userId: user._id, userType: "user" });

       const sendLocation = () => {
        navigator.geolocation.getCurrentPosition(   //a browser api that lets you access user's device location
          (position) => {
            // console.log({
            //   lat: position.coords.latitude,
            //   lng: position.coords.longitude,
            // })
            
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrLocation(location)
            socket.emit("update-user-loc", {
              userId: user._id,
              location,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      };
   
      sendLocation(); // Initial send
      const intervalId = setInterval(sendLocation, 2000); // Every 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [user]);


  //socket uses
  socket.on("ride-confirm", (ride) => {
    setveichleFound(false);
    setwaitingForDriver(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    // console.log("start ride on frontend");
    setwaitingForDriver(false);
    navigate("/riding", { state: { ride,
      pickupCoords,
      dropCoords,
      geometry,
      currLocation
    } });
  });

  //for animation of pages
  useGSAP(() => {
    if (pannelOpen) {
      gsap.to(pannelRef.current, {
        height: "100%",
        padding: 24,
      });
      gsap.to(pannelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(pannelRef.current, {
        height: "0%",
        padding: 0,
      });
      gsap.to(pannelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [user, socket]);

  // Socket event listeners
  useEffect(() => {
    const handleRideConfirm = (rideData) => {
      setveichleFound(false);
      setwaitingForDriver(true);
      setRide(rideData);
    };

    const handleRideStarted = (rideData) => {
      setwaitingForDriver(false);
      navigate("/riding", {
        state: {
          ride: rideData,
          pickupCoords,
          dropCoords,
          geometry,
          currLocation,
        },
      });
    };

    socket.on("ride-confirm", handleRideConfirm);
    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("ride-confirm", handleRideConfirm);
      socket.off("ride-started", handleRideStarted);
    };
  }, [socket, navigate, pickupCoords, dropCoords, geometry, currLocation]);

  // GSAP Animations (keep your existing animations)
  // useGSAP(() => {
  //   if (pannelOpen) {
  //     gsap.to(pannelRef.current, {
  //       height: "100%",
  //       padding: 24,
  //       duration: 0.3,
  //     });
  //     gsap.to(pannelCloseRef.current, {
  //       opacity: 1,
  //       duration: 0.3,
  //     });
  //   } else {
  //     gsap.to(pannelRef.current, {
  //       height: "0%",
  //       padding: 0,
  //       duration: 0.3,
  //     });
  //     gsap.to(pannelCloseRef.current, {
  //       opacity: 0,
  //       duration: 0.3,
  //     });
  //   }
  // }, [pannelOpen]);

  useGSAP(() => {
    if (veichleSelection) {
      gsap.to(veichleSelectionRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
      });
    } else {
      gsap.to(veichleSelectionRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
      });
    }
  }, [veichleSelection]);

  useGSAP(() => {
    if (confirmVeichle) {
      gsap.to(confirmVeichleRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
      });
    } else {
      gsap.to(confirmVeichleRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
      });
    }
  }, [confirmVeichle]);

  useGSAP(() => {
    if (veichleFound) {
      gsap.to(veichleFoundRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
      });
    } else {
      gsap.to(veichleFoundRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
      });
    }
  }, [veichleFound]);

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
      });
    }
  }, [waitingForDriver]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // Handle input changes for suggestions
  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);

    if (!value) {
      setPickupSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error.message);
      setPickupSuggestions([]);
    }
  };

  const handleDropChange = async (e) => {
    const value = e.target.value;
    setDrop(value);

    if (!value) {
      setDropSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );


      // console.log(response.data);
      if (!response) {
        console.log("suggestion not get ");
      }


      setDropSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching drop suggestions:", error.message);
      setDropSuggestions([]);
    }
  };

  // Function to handle find trip
  async function findTrip(pickupLocation = pickup, dropLocation = drop) {
    setveichleSelection(true);
    setPannelOpen(false);


    if (!pickupLocation || !dropLocation) {
      alert("Please provide valid addresses");
      setveichleSelection(false);
      return;
    }

    // API call for coordinates and geometry
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
        { pickup: pickupLocation, drop: dropLocation },
    if (!pickup || !drop) {
      alert("provide valid address");
      setveichleSelection(false);
    }

    // API call for coordinates and geometry moved here
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
        { pickup, drop },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );


      const [pickupLng, pickupLat] = response.data.coordinates[0];
      const [dropLng, dropLat] = response.data.coordinates[1];

      setPickupCoords([pickupLat, pickupLng]);
      setDropCoords([dropLat, dropLng]);
      setGeometry(response.data.geometry);

      //  console.log("fetching pickupCoords:", response.data.coordinates[0]);
      const [pickupLng, pickupLat] = response.data.coordinates[0];
      const [dropLng, dropLat] = response.data.coordinates[1];

      console.log("response:",response.data.coordinates[0],response.data.coordinates[1])
      setPickupCoords([pickupLat, pickupLng]);
      setDropCoords([dropLat, dropLng]);
      setGeometry(response.data.geometry);


    } catch (error) {
      console.error("Error in fetching coordinates:", error.message);
    }


    // API call for fares
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fares`,
        {
          params: { pickup: pickupLocation, drop: dropLocation },

    try {
      console.log("Sending request with:", { pickup, drop });
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fares`,
        {
          params: { pickup, drop },

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFares(response.data);

    } catch (error) {
      console.error("Error fetching fares:", error);

      console.log(fares);
    } catch (error) {
      console.error("Full error details:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      alert(
        `Failed to get fares: ${error.response?.data?.message || error.message}`
      );
    }
  }


  // Function to create a ride
  const createRide = async () => {
    try {
      const rideResponse = await axios.post(

  //function to create a ride
  const createRide = async () => {
    console.log("confirm clicked at home!");
    try {
      const ride = await axios.post(

        `${import.meta.env.VITE_BASE_URL}/rides/create-ride`,
        {
          pickup,
          drop,
          veichleType: selectedVehical,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Ride created:", rideResponse.data);
    } catch (error) {
      console.log("Error in creating the ride:", error);


      console.log(ride.data);
    } catch (error) {
      console.log("error in creating the ride:", error);

      throw new Error(error);
    }
  };

  // Function to handle back button
  const backButtonHandler = () => {
    if (confirmVeichle) {
      setConfirmVeichle(false);
      setTimeout(() => setveichleSelection(true), 200);
    } else if (veichleSelection) {
      setveichleSelection(false);
      setTimeout(() => setPannelOpen(true), 200);
    } else if (pannelOpen) {
      setPannelOpen(false);
    }
  };

  const handleSearchClick = () => {
    navigate("/search", {
      state: {
        currentPickup: pickup,
        currentDrop: drop,
      },
    });
  };

   const handleBack = () => {
    navigate(-1); // Go back to previous page (Home)
  };

  return (

    <div className="h-screen flex flex-col relative">
      <div className="h-screen w-full relative z-0">
        {(pannelOpen || veichleSelection || confirmVeichle) && (
          <button
            onClick={backButtonHandler}
            className="w-12 h-12 absolute left-5 top-5 z-50 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
        )}
        <HomeMap
          pickupCoords={pickupCoords}
          dropCoords={dropCoords}
          geometry={geometry}
        />
      </div>

      {/* Bottom Section */}
      <div className="w-full relative z-10 flex flex-col justify-end">
        {/* Main Search Form - Show when no panels are active */}
        {!pannelOpen &&
          !veichleSelection &&
          !confirmVeichle &&
          !veichleFound &&
          !waitingForDriver && (
            <div className="p-6 bg-transparent">
              <button
                onClick={handleSearchClick}
                className="bg-black text-white px-4 py-4 rounded-lg w-full text-lg font-semibold flex items-center justify-center gap-3"
              >
                <i className="ri-search-line text-xl"></i>
                {pickup && drop ? "Modify Trip" : "Make Trip?"}
              </button>
            </div>

    // <div className="h-screen relative">
    <div className="h-screen flex flex-col relative">
    {/* This container will hold the map and the back button */}
    <div className="h-2/3 w-full relative z-0">
      {(veichleSelection || confirmVeichle) && (
        <h5
          onClick={() => {
            backButtonHandler();
          }}
          className="w-16 absolute left-5 top-5 z-50 "
        >
          <i className="ri-arrow-left-long-line"></i>
        </h5>
      )}
      {/* <div className="h-screen w-screen"> */}
      {/* <div className="h-[65%] w-full relative z-0"> */}
        <HomeMap/>
      {/* </div> */}
      </div>
      {/* <div className="flex flex-col justify-end h-screen absolute top-0 w-full"> */}
      <div className="h-1/3 w-full relative z-10 flex flex-col justify-end">
        <div className="h-full p-6 bg-white relative">
          <h5
            ref={pannelCloseRef}
            onClick={() => {
              setPannelOpen(false);
            }}
            className="absolute right-6 top-6 text-2xl opacity-0"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-xl font-semibold ">Make a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full"></div>
            <input
              className="bg-[#eee] px-10 py-2 text-base rounded-lg  w-full  mt-5"
              type="text"
              value={pickup}
              onClick={() => {
                setPannelOpen(true);
                setActiveField("pickup");
              }}
              onChange={handlePickupChange}
              placeholder="Add a pick-up location"
            />
            <input
              className="bg-[#eee] px-10 py-2 text-base rounded-lg  w-full  mt-5"
              type="text"
              value={drop}
              onClick={() => {
                setPannelOpen(true);
                setActiveField("drop");
              }}
              onChange={handleDropChange}
              placeholder="Enter your destination"
            />
          </form>
          {pannelOpen && (
            <button
              onClick={findTrip}
              className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
            >
              Find Trip
            </button>

          )}
        {/* Vehicle Selection Panel */}
        <div
          ref={veichleSelectionRef}

          className="bg-white fixed bottom-0 left-0 right-0 transform translate-y-full z-20 px-3 rounded-t-2xl shadow-2xl"

          className="bg-white fixed z-10 bottom-0 translate-y-full w-full px-3"

        >
          <ChooseVeichleOption
            setConfirmVeichle={setConfirmVeichle}
            setveichleSelection={setveichleSelection}
            fares={fares}
            pickup={pickup}
            drop={drop}
          />
        </div>

        {/* Confirm Vehicle Panel */}
        <div
          ref={confirmVeichleRef}

          className="bg-white fixed bottom-0 left-0 right-0 transform translate-y-full z-20 px-3 py-6 rounded-t-2xl shadow-2xl"

          className="bg-white fixed z-10 bottom-0 translate-y-full w-full px-3 py-10"

        >
          <ConfirmVeichle
            setConfirmVeichle={setConfirmVeichle}
            setveichleFound={setveichleFound}
            fares={fares}
            pickup={pickup}
            drop={drop}
            createRide={createRide}
            ride={ride}
          />
        </div>

        {/* Vehicle Found Panel */}
        <div
          ref={veichleFoundRef}

          className="bg-white fixed bottom-0 left-0 right-0 transform translate-y-full z-20 px-3 py-6 rounded-t-2xl shadow-2xl"
        >
          <VeichleFound
            setveichleFound={setveichleFound}
            fares={fares}
            pickup={pickup}
            drop={drop}
            ride={ride}
          />
        </div>

        {/* Waiting for Driver Panel */}
        <div
          ref={waitingForDriverRef}
          className="bg-white fixed bottom-0 left-0 right-0 transform translate-y-full z-20 px-3 py-6 rounded-t-2xl shadow-2xl"
        >

          className="bg-white fixed z-10 bottom-0 translate-y-full w-full px-3 py-10"
        >
          <VeichleFound
            setveichleFound={setveichleFound}
            fares={fares}
            pickup={pickup}
            drop={drop}
            ride={ride}
          />
        </div>
        <div
          ref={waitingForDriverRef}
          className="bg-white fixed z-10 bottom-0 translate-y-full w-full px-3 py-10"
        >

          <WaitingForDriver
            ride={ride}
            setveichleFound={setveichleFound}
            setwaitingForDriver={setwaitingForDriver}
          />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Home;
