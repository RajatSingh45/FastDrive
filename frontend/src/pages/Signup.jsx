import React, { useState } from "react"
import {Link} from 'react-router-dom'

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [Firstname,setFtistname]=useState('')
  const [Lastname,setLastname]=useState('')
  const [userData, setUserData] = useState({})

  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      name:{
        firstname:Firstname,
        lastname:Lastname
      },
      email: email,
      password: password,
    });

    setEmail("");
    setPassword("");
    setFtistname('')
    setLastname('')
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
              reqiured
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
              value={Firstname}
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
  );
};

export default Signup;
