import { createContext, useState, useEffect } from "react";

export const captainContext = createContext();

const CaptainDataContext = ({ children }) => {
  const [captain, setCaptain] = useState(() => {
    const stored = localStorage.getItem("captain");
    if (!stored || stored === "undefined") return null;
    try{
      return JSON.parse(stored);
    }catch{
      return null;
    }
  });

  useEffect(() => {
    if (captain) {
      console.log("captain in context:",captain);
      localStorage.setItem("captain", JSON.stringify(captain));
    } else {
      localStorage.removeItem("captain");
    }
  }, [captain]);

  console.log("captain in context:",captain);
  const values = {
    captain,
    setCaptain,
  };
  return (
    <captainContext.Provider value={values}>
      {children}
    </captainContext.Provider>
  );
};

export default CaptainDataContext;
