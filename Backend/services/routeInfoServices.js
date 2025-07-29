import axios from "axios";
// import polyline from "@mapbox/polyline";

const getRouteServices = async (pickup, drop) => {
  const apiKey = process.env.MAP_API_KEY;

  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  const body = {
    coordinates: [pickup, drop],
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = response.data;
      //  console.log("ROUTE DATA:\n", JSON.stringify(data, null, 2));

      const distance = data?.routes[0]?.summary?.distance;
      const time = data?.routes[0]?.summary?.duration;
      const geometry = data?.routes[0]?.geometry;

      return { distance, time, coordinates: [pickup, drop] };
    } else return "unable to fectch the routes info";
  } catch (error) {
    console.log("error in fetching the route info:", error);
    throw error;
  }
};

const getSuggestions=async (input)=>{
   const apiKey = process.env.MAP_API_KEY;
   if (!apiKey) throw new Error("OpenRouteService API key not configured");

   const url=`https://api.openrouteservice.org/geocode/autocomplete`;

   
   try {
       const response=await axios.get(url,{
        params: { text: input,'boundary.country': 'IN', },
        headers: { 
        'Authorization': apiKey,
        'Accept': 'application/json'
       },
      });
      if(response.status===200)
        return response.data?.features;

      else
        throw new Error("unable to fetch suggestion")
   } catch (error) {
      console.log(error);
      throw error
   }
}

export {getRouteServices,getSuggestions}
