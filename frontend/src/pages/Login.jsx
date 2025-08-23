import React, { useContext } from "react";
import { useState } from "react";
import { userDataContext } from "../contexts/userDataContext";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const {setUser}=useContext(userDataContext)
  const navigate=useNavigate()

  

  const submitHandler = async(e) => {
    e.preventDefault();
    const user={
      email,
      password
    }
    
     //seding request tom backend server
     try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      user
    );

    const data = response.data;
    // console.log("response:",response);

    if (response.status === 201 && data.success) {
      setUser(data.user);
      // console.log("user while login:",data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate("/home");
    } else {
      alert(data.message || "Signin failed");
    }
  } catch (error) {
    console.error("Signin error:", error);
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
            reqiured
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
            New here?
            <Link className="text-blue-600" to="/signup">
              Create Account
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to={"/captain-login"}
          className="bg-yellow-200 flex  justify-center items-center text-black font-semibold mb-7  rounded px-4 py-2  w-full text-lg placeholder:text-base"
        >
          Signin as captain
        </Link>
      </div>
    </div>
  );
};

export default Login;
