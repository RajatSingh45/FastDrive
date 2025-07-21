import axios from "axios";

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

export default getCoordinates;
