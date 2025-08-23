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

const getNearByCaptains=async(pickup,radius)=>{

  const pickupCoords=getCoordinates(pickup);
  console.log("pickupCoords for near by captains:",pickupCoords);
  const captains=await captainModel.find({
     location: {
            $geoWithin: {
                $centerSphere: [ [ pickupCoords.ltd, pickupCoords.lng ], radius / 6371 ]  //in km
            }
        }
  })

  return captains
}

export {getCoordinates,getNearByCaptains};
