import React, { createContext, useState } from 'react'

export const captainContext=createContext();


const CaptainDataContext = ({children}) => {
    const [captain,setCaptain]=useState(null)
    const [isLoading,setIsLoading]=useState(false)
    const [error,setError]=useState(null)

    const updateCaptain=(captainData)=>{
        setCaptain(captainData)
    }

    const values={
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    }
  return (
    <captainContext.Provider value={values}>
       {children}
    </captainContext.Provider>
  )
}

export default CaptainDataContext