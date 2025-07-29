import React, { createContext, useState } from "react";

export const RideDataContext=createContext()

const RideContextProvider=({children})=>{
     const [selectedVehical, setSelectedVehical] = useState("")

    return(
            <RideDataContext.Provider value={{selectedVehical,setSelectedVehical}}>
                {children}
            </RideDataContext.Provider>
    )
}

export default RideContextProvider