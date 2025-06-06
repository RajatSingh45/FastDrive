import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // console.log("recieved token in frontend:",token);
     axios
    .get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((response) => {
      if (response.status === 200) {

        console.log("token sent to backend");
        // localStorage.removeItem("token");
        navigate("/login");
      }
    });
    
  return <div>Logout</div>;
};

export default Logout;
