import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { captainContext } from "../contexts/CaptainDataContext";

const CaptainSignup = () => {

  const{captain,setCaptain}=useContext(captainContext)
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Firstname, setFtistname] = useState("");
  const [Lastname, setLastname] = useState("");
  // const [userData, setUserData] = useState({});
  const [veichleColor, setVeichleColor] = useState("");
  const [veichlePlate, setVeichlePlate] = useState("");
  const [veichleCapacity, setVeichleCapacity] = useState("");
  const [veichleType, setVeichleType] = useState("");

  const submitHandler = async(e) => {
    e.preventDefault();

   const newCaptain={
      fullname: {
        firstname: Firstname,
        lastname: Lastname,
      },
      email: email,
      password: password,
      veichle:{
        color:veichleColor,
        plate:veichlePlate,
        capacity:parseInt(veichleCapacity),
        veichleType:veichleType
      }
    }

      try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      newCaptain
    );    
    
    if (response.status === 201) {
      const data = response.data;
      // console.log("captain name during signup:",data.captain.fullname)
      setCaptain(data.captain);
      // console.log("captain in signup:",captain)
      // localStorage.setItem('captain', JSON.stringify(response.data.captain));
      localStorage.setItem('token',data.token);
      navigate("/captain-home");
    } else {
      alert(response.dats.message || "Signup failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong during signup.");
  }
    setEmail("");
    setPassword("");
    setFtistname("");
    setLastname("");
    setVeichleColor("")
    setVeichleCapacity("")
    setVeichlePlate("")
    setVeichleType("")
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
          <h3 className="text-lg font-medium mb-2">What's your name</h3>
          <div>
            <input
              value={Firstname}
              onChange={(e) => {
                setFtistname(e.target.value);
              }}
              className="bg-[#eeeeee] mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-base"
              type="text"
              placeholder="First Name"
              required
            />
            <input
              value={Lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              className="bg-[#eeeeee] mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-base"
              type="text"
              placeholder="Second Name"
            />
          </div>
          <h3 className="text-lg font-medium mb-2">Enter Email</h3>
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
          <h3 className="text-lg font-medium mb-2">Veichle Details</h3>
          <div className="flex gap-4">
            <input
              value={veichleColor}
              onChange={(e) => {
                setVeichleColor(e.target.value);
              }}
              className="bg-[#eeeeee] mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-base"
              type="text"
              placeholder="Veichle colour"
              required
            />
            <input
              value={veichlePlate}
              onChange={(e) => {
                setVeichlePlate(e.target.value);
              }}
              className="bg-[#eeeeee] mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-base"
              type="text"
              placeholder="Veichle number"
              required
            />
          </div>
          <div className="flex gap-4">
            <input
              value={veichleCapacity}
              onChange={(e) => {
                setVeichleCapacity(e.target.value);
              }}
              className="bg-[#eeeeee] mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-base"
              type="text"
              placeholder="Veichle capacity"
              required
            />
            <select
              className="bg-[#eeeeee] mb-7  rounded px-4 py-2 border w-full text-lg placeholder:text-base"
              value={veichleType}
              onChange={(e)=>{
                setVeichleType(e.target.value)
              }}
              required
            >
              <option value="" disabled>Veichle type</option>
              <option value="Car">Car</option>
              <option value="Motor Bike">Motorcycle</option>
              <option value="Auto">Auto</option>
            </select>
          </div>
          <button className="bg-[#111] text-white font-semibold mb-7  rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Crete new account
          </button>
          <p className="text-center">
            Already have an account?
            <Link className="text-blue-600" to="/captain-login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CaptainSignup;
