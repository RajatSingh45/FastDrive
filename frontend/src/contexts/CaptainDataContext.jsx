import { createContext, useState, useEffect } from "react";

export const captainContext = createContext();

const CaptainDataContext = ({ children }) => {
  const [captain, setCaptain] = useState(() => {
    try {
      const storedCaptain = localStorage.getItem("captain");
      // console.log("captain from localstorage in captainContext:",storedCaptain);
      return storedCaptain ? JSON.parse(storedCaptain) : null;
    } catch {
      localStorage.removeItem("captain");
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

// useEffect(() => {
//   console.log("CaptainDataContext mounted");
// }, []);

  // Save captain to localStorage whenever it changes
  useEffect(() => {
    if (captain) {
      localStorage.setItem("captain", JSON.stringify(captain));
    } 
    console.log("captain in context:", captain);
  }, [captain]);

  const updateCaptain = (captainData) => {
    setCaptain(captainData);
  };

  const values = {
    captain,
    setCaptain,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateCaptain,
  };
  return (
    <captainContext.Provider value={values}>
      {children}
    </captainContext.Provider>
  );
};

export default CaptainDataContext;
