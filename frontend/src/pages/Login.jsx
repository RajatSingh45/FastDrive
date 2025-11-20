import React, { useContext, useState } from "react";
import { userDataContext } from "../contexts/userDataContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const user = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        user,
        {withCredentials:true}
      );

      const data = response.data;

      if (response.status === 201 && data.success) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
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

    // <div className="h-screen flex flex-col  bg-gray-50 p-8 max-w-md mx-auto lg:max-w-lg lg:shadow-lg lg:rounded-xl lg:my-8 right-0">

    <div className="h-screen flex flex-col  bg-gray-50 p-8">
      <div>
        <form onSubmit={submitHandler} className="space-y-5">
         
            <h3 className="text-black font-semibold text-lg mb-2">
              What's your email
            </h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@example.com"
              required
              className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-900 mb-7 placeholder:text-gray-700 text-lg "
            />
            <h3 className="text-black font-semibold text-lg mb-2">
              Enter Password
            </h3>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
              required
              className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-900 placeholder:text-gray-700 text-lg"
            />
          <button
            type="submit"
            className="w-full bg-black text-gray-200 text-lg font-semibold py-3 rounded-lg hover:bg-gray-900 transition-all duration-200 cursor-pointer"
          >
            Login
          </button>

          <p className="text-center text-black text-sm">
            New here?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create Account
            </Link>
          </p>
        </form>
      </div>

      {/* Captain Login */}
      <div>
        <Link
          to={"/captain-login"}
          className="w-full block text-center bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 rounded-lg text-lg transition-all duration-200 cursor-pointer"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
    // </div>
  );
};

export default Login;

