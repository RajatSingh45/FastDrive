import { useGSAP } from '@gsap/react';
import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import gsap from "gsap";

const CaptainRiding = () => {
  const [finishRidePannel, setFinishRidePannel] = useState(false)
  const finishRidePannelRef=useRef(null)
  const location=useLocation()
  const rideData=location.state?.ride

  useGSAP(()=>{
    if(finishRidePannel){
      gsap.to(finishRidePannelRef.current,{
        transform:"translateY(0)"
      })
    }
    else{
      gsap.to(finishRidePannelRef.current,{
        transform:"translateY(100%)"
      })
    }
  },[finishRidePannel])


  return (
     <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-full">
        <img
          className="w-16"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt="uber logo"
        />
        <Link
          to="/captain-login"
          className="fixed right-2 top-2 flex items-center justify-center rounded-full w-10 h-10 bg-white"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://th.bing.com/th/id/OIP._0rSU5b1l_1q_2CNBBvuSQHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2"
          alt=""
        />
      </div>
         <div className='h-1/5 p-6 flex items-center justify-between'>
          <h4 className='text-xl font-semibold' >2 Km Away</h4>
          <button className='bg-yellow-300 font-semibold p-3 px-10 rounded-lg text-gray-600' onClick={()=>{setFinishRidePannel(true)}}>Complete Ride</button>
         </div>

          <div ref={finishRidePannelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePannel={setFinishRidePannel} />
            </div>
    </div>
  );
}

export default CaptainRiding