import axios from "axios";
import captainModel from "../models/captainModel.js";

const getCoordinates = async (address) => {
  const apiKey = process.env.MAP_API_KEY;
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
    address
  )}`;
  try {
    const response = await axios.get(url);
    return response.data.features[0]?.geometry.coordinates;
  } catch (error) {
    console.log("error in fetcing the coordinates");
    throw error;
  }
};

const getNearByCaptains = async (lng, lat, radius) => {
  if (typeof lng !== "number" || typeof lat !== "number") {
    throw new Error("Invalid coordinates for nearby captain search");
  }
  
  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius / 6371], // [lng, lat]
      },
    },
  });
  // console.log("captains in services:", captains);
  return captains;
};

export { getCoordinates, getNearByCaptains };
