import React, { useState } from "react";

const Home = () => {
  const [pickup,setPickup]=useState('')
  const [destination,setDestination]=useState('')

  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <div className="h-screen relative">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
        alt="uber logo"
      />
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://th.bing.com/th/id/OIP._0rSU5b1l_1q_2CNBBvuSQHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2"
          alt=""
        />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full ">
        <div className="h-[30%] p-5 bg-white relative">
          <h4 className="text-2xl font-semibold ">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full"></div>
            <input
              className="bg-[#eee] px-10 py-2 text-base rounded-lg  w-full  mt-5"
              type="text"
              value={pickup}
              onChange={(e)=>{
                setPickup(e.target.value)
              }}
              placeholder="Add a pick-up location"
            />
            <input
              className="bg-[#eee] px-10 py-2 text-base rounded-lg  w-full  mt-5"
              type="text"
              value={destination}
              onChange={(e)=>{
                setDestination(e.target.value)
              }}
              placeholder="Enter your destination"
            />
          </form>
        </div>
        <div className="bg-red-500 h-0"></div>
      </div>
    </div>
  );
};

export default Home;
