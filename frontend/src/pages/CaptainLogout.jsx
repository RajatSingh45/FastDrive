import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { captainContext } from "../contexts/CaptainDataContext";

const CaptainLogout = () => {
  const navigate = useNavigate();
  const {captain}=useContext(captainContext)
  
  useEffect(() => {
     const token = localStorage.getItem("token");

  // console.log("recieved token in frontend:",token);
     axios
    .get(`${import.meta.env.VITE_BASE_URL}/captains/captain-logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((response) => {
      if (response.status === 200) {

        //  console.log("token sent to backend");
        localStorage.removeItem("token");
        localStorage.removeItem("captain")
        navigate("/captain-login");
      }
    })
  }, [navigate])

    
  return <div>CaptainLogout</div>;
};

export default CaptainLogout;
