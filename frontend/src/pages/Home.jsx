import React, { useRef, useState, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import SearchPannel from "../components/SearchPannel";
import ChooseVeichleOption from "../components/ChooseVeichleOption";
import ConfirmVeichle from "../components/ConfirmVeichle";
import VeichleFound from "../components/veichleFound";
import WaitingForDriver from "../components/WaitingForDriver";
import { RideDataContext } from "../contexts/rideContext";
import { userDataContext } from "../contexts/userDataContext";
import { socketContext } from "../contexts/SocketContext";
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
  const [currLocation,setCurrLocation]=useState(null)
  const [geometry, setGeometry] = useState(null);

  //useRefs
  const pannelRef = useRef(null);
  const veichleSelectionRef = useRef(null);
  const confirmVeichleRef = useRef(null);
  const veichleFoundRef = useRef(null);
  const pannelCloseRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  //useContexts
  const { selectedVehical } = useContext(RideDataContext);
  const { user } = useContext(userDataContext);
  const { socket } = useContext(socketContext);

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
  }, [pannelOpen]);

  useGSAP(() => {
    // console.log("veichleSelection is called!");
    if (veichleSelection) {
      gsap.to(veichleSelectionRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(veichleSelectionRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [veichleSelection]);

  useGSAP(() => {
    if (confirmVeichle) {
      console.log("cfv open!");
      gsap.to(confirmVeichleRef.current, {
        transform: "translateY(0)",
      });
    } else {
      console.log("cfv close!");
      gsap.to(confirmVeichleRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmVeichle]);

  useGSAP(() => {
    if (veichleFound) {
      gsap.to(veichleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(veichleFoundRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [veichleFound]);

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [waitingForDriver]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  //funtion to handle pickup and drop onchnage also will set pickupSuggestion and dropSuggestion
  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);

    if (!value) {
      setPickupSuggestions([]); // Clear suggestions when input is empty
      return;
    }

    //calling the api from backend
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response.data);
      if (!response) {
        console.log("Psuggestion not get ");
      }
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

    //calling api from backend
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
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

  //function to handle find trip
  async function findTrip() {
    setveichleSelection(true);
    setPannelOpen(false);

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

      console.log(ride.data);
    } catch (error) {
      console.log("error in creating the ride:", error);
      throw new Error(error);
    }
  };

  //funtion to  handle back button apperaing on map (to jump back to previous page)
  const backButtonHandler = () => {
    if (confirmVeichle) {
      setConfirmVeichle(false);
      setTimeout(() => setveichleSelection(true), 200);
    } else if (veichleSelection) {
      setveichleSelection(false);
      setTimeout(() => setPannelOpen(true), 200);
    }
  };

  return (
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
        </div>
        <div
          ref={pannelRef}
          className={`bg-white h-0 ${pannelOpen ? "" : "hidden"}`}
        >
          <SearchPannel
            suggestions={
              activeField === "pickup" ? pickupSuggestions : dropSuggestions
            }
            setPickup={setPickup}
            setDrop={setDrop}
            activeField={activeField}
            setveichleSelection={setveichleSelection}
            setPannelOpen={setPannelOpen}
            findTrip={findTrip}
          />
        </div>
        <div
          ref={veichleSelectionRef}
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
        <div
          ref={confirmVeichleRef}
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
        <div
          ref={veichleFoundRef}
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
