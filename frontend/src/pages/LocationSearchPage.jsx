import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RideDataContext } from "../contexts/rideContext";
import "remixicon/fonts/remixicon.css";

const SearchPage = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [activeField, setActiveField] = useState("");
  
  const navigate = useNavigate();
  const { setRideData } = useContext(RideDataContext);

  // Handle input changes and fetch suggestions
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

  const handleSuggestionClick = (suggestion, field) => {
    const selectedLocation = suggestion.properties.name;
    
    if (field === 'pickup') {
      setPickup(selectedLocation);
      setPickupSuggestions([]);
      setActiveField("");
    } else {
      setDrop(selectedLocation);
      setDropSuggestions([]);
      setActiveField("");
    }
  };

  const handleFindTrip = () => {
    if (!pickup || !drop) {
      alert("Please provide both pickup and drop locations");
      return;
    }
    
    // Navigate to /home (Home/Map page) instead of / (Start page)
    navigate("/home", { 
      state: { 
        pickup, 
        drop,
        shouldShowVehicleSelection: true 
      } 
    });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page (Home)
  };

  // Clear suggestions when clicking outside
  const handleInputBlur = () => {
    setTimeout(() => {
      setActiveField("");
    }, 200);
  };

  return (
    <div className="h-screen bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="mr-4 text-2xl"
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          <h1 className="text-xl font-semibold">Where to?</h1>
        </div>
      </div>

      {/* Search Form */}
      <div className="p-6 space-y-4">
        {/* Pickup Input */}
        <div className="relative">
          <div className="flex items-center bg-[#eee] rounded-lg px-4 py-3">
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              <i className="ri-map-pin-fill text-gray-600"></i>
            </div>
            <input
              type="text"
              value={pickup}
              onChange={handlePickupChange}
              onFocus={() => setActiveField('pickup')}
              onBlur={handleInputBlur}
              placeholder="Add a pick-up location"
              className="bg-transparent w-full outline-none"
            />
          </div>
        </div>

        {/* Drop Input */}
        <div className="relative">
          <div className="flex items-center bg-[#eee] rounded-lg px-4 py-3">
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              <i className="ri-flag-fill text-gray-600"></i>
            </div>
            <input
              type="text"
              value={drop}
              onChange={handleDropChange}
              onFocus={() => setActiveField('drop')}
              onBlur={handleInputBlur}
              placeholder="Enter your destination"
              className="bg-transparent w-full outline-none"
            />
          </div>
        </div>
            {/* Find Trip Button - Fixed at bottom */}
      {/* <div className="fixed left-0 right-0 p-6 bg-white border-t border-gray-200"> */}
        <button
          onClick={handleFindTrip}
          disabled={!pickup || !drop}
          className={`w-full py-4 rounded-lg font-semibold text-lg ${
            pickup && drop 
              ? 'bg-black text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Find Trip
        </button>
      {/* </div> */}
      </div>

      {/* Suggestions Panel - Full screen below search bars */}
      {(activeField === 'pickup' && pickupSuggestions.length > 0) || 
       (activeField === 'drop' && dropSuggestions.length > 0) ? (
        <div className=" top-40 left-0 right-0 bottom-0 bg-white z-10 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {activeField === 'pickup' ? 'Pickup Locations' : 'Destination Locations'}
            </h3>
            
            {/* Suggestions List */}
            {(activeField === 'pickup' ? pickupSuggestions : dropSuggestions).map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(suggestion, activeField)}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center transition-colors duration-200"
              >
                <div className="w-10 h-10 flex items-center justify-center mr-4 bg-gray-100 rounded-full">
                  <i className={`ri-map-pin-${activeField === 'pickup' ? 'fill' : 'line'} text-gray-600`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{suggestion.properties.name}</p>
                  {suggestion.properties.address && (
                    <p className="text-sm text-gray-500 mt-1">{suggestion.properties.address}</p>
                  )}
                </div>
                <i className="ri-arrow-right-s-line text-gray-400 text-lg"></i>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Recent Searches or Empty State when no suggestions are shown */
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Searches</h3>
          <div className="text-center py-8 text-gray-500">
            <i className="ri-search-line text-4xl mb-3"></i>
            <p>Enter a location to see suggestions</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;