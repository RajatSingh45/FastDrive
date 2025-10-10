import {React, useContext} from 'react'
import {RideDataContext} from "../contexts/rideContext";

const VeichleFound = (props) => {
  const {selectedVehical}=useContext(RideDataContext)
  return (
           <div>
      <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>
      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          src="https://th.bing.com/th/id/OIP.ymjpxr4RPlwbLenCbbpYywHaE7?rs=1&pid=ImgDetMain"
          alt="veichle"
          className="h-20"
        />
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 border-b-2">
            <i className="ri-map-pin-line"></i>
            <div>
              {/* <h3 className="text-lg font-medium">562/11-A</h3> */}
              <h1 className="text-sm -mt-1 text-gray-600">
                {props.pickup}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-line"></i>
            <div>
              {/* <h3 className="text-lg font-medium">562/11-A</h3> */}
              <h1 className="text-sm -mt-1 text-gray-600">{props.drop}</h1>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h1 className="text-lg font-medium">Rs {props.fares?.[`${selectedVehical}Fare`] ?? "0"}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VeichleFound