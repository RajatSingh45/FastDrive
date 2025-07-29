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
      {suggestions.map(function (suggestion, idx) {
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
