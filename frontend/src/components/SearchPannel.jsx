import {React,useEffect} from "react";

const SearchPannel = ({suggestions,setPickup,setDrop,activeField,drop,findTrip,pickup}) => {

 const handleSuggestionsOnClick=(suggestion)=>{
  const selectedLocation=suggestion.properties.name

    if (activeField === 'pickup') {
      setPickup(selectedLocation);
    } else if(activeField==='drop') {
      setDrop(selectedLocation);
      // findTrip()
    }
 }

  return (
    <div>
      {suggestions?.map(function (suggestion, idx) {
        return (
          <div
            key={idx}
            onClick={()=>handleSuggestionsOnClick(suggestion)}
            className=" mt-0 active:border-2 p-3 active:border-black rounded-xl flex items-center gap-4 my-4 justify-start"
          >
            <h2 className="bg-[#eee] w-11 h-8 flex items-center justify-center rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h2 className="font-medium">{suggestion.properties.name}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default SearchPannel;


// import {React,useEffect} from "react";

// const SearchPannel = ({suggestions,setPickup,setDrop,activeField,drop,findTrip,pickup}) => {

//  const handleSuggestionsOnClick=(suggestion)=>{
//   const selectedLocation=suggestion.properties.name

//     if (activeField === 'pickup') {
//       setPickup(selectedLocation);
//     } else if(activeField==='drop') {
//       setDrop(selectedLocation);
//     }
//  }

//   return (
//     <div className="p-4 lg:p-6">
//       <h3 className="text-lg font-semibold mb-4 lg:text-xl lg:mb-6">
//         Select {activeField === 'pickup' ? 'Pickup' : 'Drop'} Location
//       </h3>
//       {suggestions?.map(function (suggestion, idx) {
//         return (
//           <div
//             key={idx}
//             onClick={()=>handleSuggestionsOnClick(suggestion)}
//             className="mt-0 p-3 lg:p-4 rounded-xl flex items-center gap-4 my-4 justify-start hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
//           >
//             <div className="bg-[#eee] w-11 h-8 lg:w-12 lg:h-10 flex items-center justify-center rounded-full">
//               <i className="ri-map-pin-fill text-gray-600"></i>
//             </div>
//             <h2 className="font-medium text-sm lg:text-base">{suggestion.properties.name}</h2>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SearchPannel;