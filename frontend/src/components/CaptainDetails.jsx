import React, {useEffect, useState } from "react";
import axios from 'axios'

const CaptainDetails = () => {
// const { captain } = useContext(captainContext);
const [captain,setCaptain]=useState(null)
const [captainData,setCaptainData]=useState(null)

useEffect(() => {
  const storedCaptain = localStorage.getItem('captain');
  if (storedCaptain) {
    setCaptain(JSON.parse(storedCaptain));
  } else {
    setCaptain(null);
  }

  const token=localStorage.getItem('token')

  const fetchProfile=async ()=>{
    try {
      const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });

      setCaptainData(response.data)
    } catch (error) {
      console.error("Error in fetching captain profile:",error)
      setCaptainData(null)
    }
  }

  fetchProfile();

  // console.log("captain in details:", storedCaptain);
}, [])

   if (!captain) return <p>No captain data available...</p>;


  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3 mr-10">
          <img
            className="h-10 w-10 object-cover rounded-full"
            src="https://th.bing.com/th/id/OIP._ABagscIv6THcS0vD8XczQHaE8?w=272&h=181&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3"
          />
          <h4 className="text-xl font-medium capitalize">{captain?.fullname?.firstname} {captain?.fullname?.lastname}</h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">Rs {captainData?.totalEarn}</h4>
          <p className="text-base text-gray-600">Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-6 bg-gray-50 rounded-xl justify-center gap-5 items-center">
        <div className="text-center ">
          <i className="text-3xl fonrt-thin ri-time-line"></i>
          <h5 className="font-medium text-lg">10.2</h5>
          <p className="text-gray-600 text-sm">Hours online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl fonrt-thin ri-speed-up-fill"></i>
          <h5 className="font-medium text-lg">Rides</h5>
          <p className="text-gray-600 text-sm">Hours online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl fonrt-thin ri-booklet-line"></i>
          <h5 className="font-medium text-lg">10.2</h5>
          <p className="text-gray-600 text-sm">Hours online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
