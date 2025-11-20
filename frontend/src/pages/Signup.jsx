import React, { useContext, useState } from "react"
import {Link, useNavigate} from 'react-router-dom'
import {userDataContext} from '../contexts/userDataContext'
import axios from 'axios'

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [Firstname,setFirstname]=useState('')
  const [Lastname,setLastname]=useState('')
  const [userData, setUserData] = useState({})

  const navigate=useNavigate()
  const { user, setUser } = useContext(userDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    //creating new user
    const newUser={
      fullname:{
        firstname:Firstname,
        lastname:Lastname
      },
      email,
      password
    }

    //seding request tom backend server
     try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      newUser,
      {withCredentials:true}
    );

    const data = response.data;

    if (response.status === 201 && data.success) {
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate("/home");
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong during signup.");
  }
    setEmail("");
    setPassword("");
    setFirstname('')
    setLastname('')
  };
  return (
    // <div className="h-screen flex flex-col justify-center bg-gray-50 p-8 max-w-md mx-auto lg:max-w-lg lg:shadow-lg lg:rounded-xl lg:my-8">
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
                setFirstname(e.target.value);
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
          <button className="bg-[#111] text-white font-semibold mb-7  rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Sign Up
          </button>
          <p className="text-center">
            Already have an account?
            <Link className="text-blue-600" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
    // </div>
  );
};

export default Signup;
