import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { captainContext } from "../contexts/CaptainDataContext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading,setIsLoading]=useState(true)
  const {setCaptain}=useContext(captainContext)
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // console.log("token not recieved!")
      navigate("/captain-login");
      return;
    }

    // console.log("token recieved in wrapper:",token)
  axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
     headers: {
        Authorization: `Bearer ${token}`,
      }
  }).then(response=>{
    if(response.status===200){
      setCaptain(response.data.captain)
      setIsLoading(false)
    }
  })
    .catch(err=>{
      console.log(err)
      localStorage.removeItem('token')
      navigate('/captain-login')
    })
  },[])

  if(isLoading){
    return(
      <div>Loading...</div>
    )
  }

  return (
  <>{children}</>
  )
};

export default CaptainProtectWrapper;