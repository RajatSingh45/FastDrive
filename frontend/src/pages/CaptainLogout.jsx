import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CaptainLogout = () => {
  const navigate = useNavigate();
  
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

         console.log("token sent to backend");
        localStorage.removeItem("token");
        navigate("/captain-login");
      }
    })
  }, [navigate])

    
  return <div>CaptainLogout</div>;
};

export default CaptainLogout;
