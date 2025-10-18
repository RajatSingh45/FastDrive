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
    
    // console.log("response in login:",response);
    
    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      // console.log("data.captain->",data.captain);
      localStorage.setItem('captain', JSON.stringify(data.captain));
      // console.log("local storage:",localStorage.getItem('captain'));
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
    <div className="bg-gray-50 p-8  flex flex-col min-h-screen">
      <div>
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-semibold text-black mb-2">What's your email</h3>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-gray-100 border-gray-300 text-gray-900 mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-gray-700"
            type="email"
            placeholder="email@example.com"
            required
          />
          <h3 className="text-lg font-semibold mb-2 text-black">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-gray-100 border-gray-300 mb-7 text-gray-900 rounded px-4 py-2 border w-full text-lg placeholder:text-gray-700"
            type="password"
            placeholder="password"
            required
          />
          <button className="bg-black text-gray-200 font-semibold rounded-lg py-3 transition-all duration-200  w-full text-lg hover:bg-gray-900 cursor-pointer">
            Login
          </button>
          <p className="text-center text-sm text-black">
            Join as new driver?
            <Link className="text-blue-600 hover:underline" to="/captain-signup">
              Create Account
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to={"/login"}
          className="bg-gray-300 hover:bg-gray-400  justify-center  text-black font-semibold rounded-lg  py-3  w-full block text-lg transition-all duration-200 cursor-pointer text-center"
        >
          Signin as user
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
