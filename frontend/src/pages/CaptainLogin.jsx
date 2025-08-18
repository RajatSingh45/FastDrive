import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { captainContext } from "../contexts/CaptainDataContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(captainContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const signInCaptain = {
      email: email,
      password
    };

    //calling backend
    try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/login`,
      signInCaptain
    );
    
    console.log("response in login:",response);
    
    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      console.log("data.captain->",data.captain);
      localStorage.setItem('captain', JSON.stringify(data.captain));
      console.log("local storage:",localStorage.getItem('captain'));
      localStorage.setItem('token', data.token);
      navigate("/captain-home");
    } else {
      alert(data.message || "Signin failed");
    }
  } catch (error) {  
    console.error("Signup error:", error.response?.data ||error.message);
    alert("Something went wrong during signin.");
  }
    setEmail("");
    setPassword("");
  };
  
  return (
    <div className="p-7 flex flex-col justify-between h-scree">
      <div>
        <img
          className="w-16 mb-5"
          src="https://th.bing.com/th/id/OIP.nm1FItlXC1Gk_ed4g2EINAHaCm?cb=iwp2&rs=1&pid=ImgDetMain"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            required
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password"
            placeholder="password"
            required
          />
          <button className="bg-[#111] text-white font-semibold mb-7  rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Login
          </button>
          <p className="text-center">
            Join as new driver?
            <Link className="text-blue-600" to="/captain-signup">
              Create Account
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to={"/login"}
          className="bg-yellow-200 flex  justify-center items-center text-black font-semibold mb-7  rounded px-4 py-2  w-full text-lg placeholder:text-base"
        >
          Signin as user
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
