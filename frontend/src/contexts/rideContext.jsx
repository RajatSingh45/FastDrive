// import React, { createContext, useState } from "react";

// export const RideDataContext=createContext()

// const RideContextProvider=({children})=>{
//      const [selectedVehical, setSelectedVehical] = useState("")

//     return(
//             <RideDataContext.Provider value={{selectedVehical,setSelectedVehical}}>
//                 {children}
//             </RideDataContext.Provider>
//     )
// }

// export default RideContextProvider


import React, { createContext, useState } from "react";

export const RideDataContext = createContext();

const RideContextProvider = ({ children }) => {
  const [selectedVehical, setSelectedVehical] = useState("");
  const [rideData, setRideData] = useState({
    pickup: '',
    drop: '',
    pickupCoords: null,
    dropCoords: null,
    geometry: null,
    fares: {},
    ride: null
  });

  return (
    <RideDataContext.Provider value={{
      selectedVehical, 
      setSelectedVehical,
      rideData,
      setRideData
    }}>
      {children}
    </RideDataContext.Provider>
  );
}

export default RideContextProvider;