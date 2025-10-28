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

const Home = () => {
  //useStates
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pannelOpen, setPannelOpen] = useState(false);
  const [veichleSelection, setveichleSelection] = useState(false);
  const [confirmVeichle, setConfirmVeichle] = useState(false);
  const [veichleFound, setveichleFound] = useState(false);
  const [waitingForDriver, setwaitingForDriver] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [fares, setFares] = useState({});
  const [ride, setRide] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [currLocation, setCurrLocation] = useState(null);
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

  //useNavigate and useLocation
  const navigate = useNavigate();
  const location = useLocation();

  //useEffects
  // Check if we have data from search page
  useEffect(() => {
    if (location.state?.pickup && location.state?.drop) {
      const { pickup, drop } = location.state;
      setPickup(pickup);
      setDrop(drop);
      // Automatically open vehicle selection
      setveichleSelection(true);
      findTrip(pickup, drop);
    }
  }, [location.state]);

  // Socket and location updates
  useEffect(() => {
    if (user && user._id) {
      socket.emit("join", { userId: user._id, userType: "user" });

      const sendLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrLocation(location);
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

      sendLocation();
      const intervalId = setInterval(sendLocation, 2000);
      return () => clearInterval(intervalId);
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

  // GSAP Animations with null checks
  useGSAP(() => {
    if (!pannelRef.current) return;

    if (pannelOpen) {
      gsap.to(pannelRef.current, {
        height: "100%",
        padding: 24,
        duration: 0.3,
      });
      if (pannelCloseRef.current) {
        gsap.to(pannelCloseRef.current, {
          opacity: 1,
          duration: 0.3,
        });
      }
    } else {
      gsap.to(pannelRef.current, {
        height: "0%",
        padding: 0,
        duration: 0.3,
      });
      if (pannelCloseRef.current) {
        gsap.to(pannelCloseRef.current, {
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  }, [pannelOpen]);

  useGSAP(() => {
    if (!veichleSelectionRef.current) return;

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
    if (!confirmVeichleRef.current) return;

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
    if (!veichleFoundRef.current) return;

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
    if (!waitingForDriverRef.current) return;

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
    } catch (error) {
      console.error("Error in fetching coordinates:", error.message);
    }

    // API call for fares
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fares`,
        {
          params: { pickup: pickupLocation, drop: dropLocation },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFares(response.data);
    } catch (error) {
      console.error("Error fetching fares:", error);
      alert(
        `Failed to get fares: ${error.response?.data?.message || error.message}`
      );
    }
  }

  // Function to create a ride
  const createRide = async () => {
    try {
      const rideResponse = await axios.post(
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

  return (
    <div className="h-screen flex flex-col relative">
      {/* Map Container */}
      <div className="h-2/3 w-full relative z-0">
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
      <div className="h-1/3 w-full relative z-10 flex flex-col justify-end">
        {/* Main Search Form - Show when no panels are active */}
        {!pannelOpen &&
          !veichleSelection &&
          !confirmVeichle &&
          !veichleFound &&
          !waitingForDriver && (
            <div className="p-6 bg-white">
              <button
                onClick={handleSearchClick}
                className="bg-black text-white px-4 py-4 rounded-lg w-full text-lg font-semibold flex items-center justify-center gap-3"
              >
                <i className="ri-search-line text-xl"></i>
                {pickup && drop ? "Modify Trip" : "Where to?"}
              </button>
            </div>
          )}

        {/* Search Panel - Always render but control visibility with GSAP */}
        <div
          ref={pannelRef}
          className="bg-white absolute bottom-0 left-0 right-0 h-0 overflow-hidden"
        >
          <div className="relative p-6">
            <h5
              ref={pannelCloseRef}
              onClick={() => setPannelOpen(false)}
              className="absolute right-6 top-6 text-2xl cursor-pointer"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h4 className="text-xl font-semibold mb-4">Make a trip</h4>
            <form onSubmit={submitHandler}>
              <input
                className="bg-[#eee] px-10 py-2 text-base rounded-lg w-full mt-5"
                type="text"
                value={pickup}
                onClick={() => {
                  setActiveField("pickup");
                }}
                onChange={handlePickupChange}
                placeholder="Add a pick-up location"
              />
              <input
                className="bg-[#eee] px-10 py-2 text-base rounded-lg w-full mt-5"
                type="text"
                value={drop}
                onClick={() => {
                  setActiveField("drop");
                }}
                onChange={handleDropChange}
                placeholder="Enter your destination"
              />
            </form>
            {pannelOpen && (
              <button
                onClick={() => findTrip()}
                className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
              >
                Find Trip
              </button>
            )}
          </div>

          {/* Suggestions */}
          {pannelOpen && (
            <div className="px-6 pb-6">
              <SearchPannel
                suggestions={
                  activeField === "pickup" ? pickupSuggestions : dropSuggestions
                }
                setPickup={setPickup}
                setDrop={setDrop}
                activeField={activeField}
                setPannelOpen={setPannelOpen}
                findTrip={findTrip}
              />
            </div>
          )}
        </div>

        {/* Vehicle Selection Panel - Always render but control visibility with GSAP */}
        <div
          ref={veichleSelectionRef}
          className="bg-white fixed bottom-0 left-0 right-0 transform translate-y-full z-20 px-3 rounded-t-2xl shadow-2xl"
        >
          <ChooseVeichleOption
            setConfirmVeichle={setConfirmVeichle}
            setveichleSelection={setveichleSelection}
            fares={fares}
            pickup={pickup}
            drop={drop}
          />
        </div>

        {/* Confirm Vehicle Panel - Always render but control visibility with GSAP */}
        <div
          ref={confirmVeichleRef}
          className="bg-white fixed bottom-0 left-0 right-0 transform translate-y-full z-20 px-3 py-6 rounded-t-2xl shadow-2xl"
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

        {/* Vehicle Found Panel - Always render but control visibility with GSAP */}
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

        {/* Waiting for Driver Panel - Always render but control visibility with GSAP */}
        <div
          ref={waitingForDriverRef}
          className="bg-white fixed bottom-0 left-0 right-0 transform translate-y-full z-20 px-3 py-6 rounded-t-2xl shadow-2xl"
        >
          <WaitingForDriver
            ride={ride}
            setveichleFound={setveichleFound}
            setwaitingForDriver={setwaitingForDriver}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
