import React from "react";

const SearchPannel = (props) => {
  const location = [
    "#15, Bhoomika Layout, Near Amul icecream parlour, Bangalore",
    "#20A, Bhoomika Layout, Near Amul icecream parlour, Bangalore",
    "#24, Bhoomika Layout, Near Amul icecream parlour, Bangalore",
    "#10B, Bhoomika Layout, Near Amul icecream parlour, Bangalore",
  ];
  return (
    <div>
      {location.map(function (loc, idx) {
        return (
          <div
            key={idx}
            onClick={() => {
              // console.log("Address clicked!");
              props.setveichleSelection(true);
              props.setPannelOpen(false);
            }}
            className=" mt-0 active:border-2 p-3 active:border-black rounded-xl flex items-center gap-4 my-4 justify-start"
          >
            <h2 className="bg-[#eee] w-11 h-8 flex items-center justify-center rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h2 className="font-medium">{loc}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default SearchPannel;
