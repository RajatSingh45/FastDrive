import React from 'react'
import {Link} from 'react-router-dom'

const Riding = () => {
  return (
     <div className='h-screen'>
        <Link to='/home' className='fixed right-2 top-2 flex items-center justify-center rounded-full w-10 h-10 bg-white'>
        <i className="text-lg font-medium ri-home-2-line"></i>
        </Link>
        <div className='h-1/2'>
             <img
          className="h-full w-full object-cover"
          src="https://th.bing.com/th/id/OIP._0rSU5b1l_1q_2CNBBvuSQHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2"
          alt=""
        />
        </div>
         <div className='h-1/2 p-4'>
          <div className='flex items-center justify-between'>
           <img
          src="https://th.bing.com/th/id/OIP.ymjpxr4RPlwbLenCbbpYywHaE7?rs=1&pid=ImgDetMain"
          alt="veichle"
          className="h-12"
        />
        <div className='text-right'>
        <h2 className='text-lg font-medium'>Rajat</h2>
        <h4 className='text-xl font-semibold -mt-1 -mb-1'>UP20 AB 0143B</h4>
        <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
        </div>
      </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-line"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">Kirloskar Layout</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">Rs200</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
         <button className="w-full bg-green-600 font-semibold p-2 rounded-lg">Make Payment</button>
         </div>
        </div>
  )
}

export default Riding