import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import captainModel from "../models/captainModel.js";
import blackListTokenModel from '../models/blackListTokenModel.js'

const captainAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

   console.log(req.cookies.token)
//  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unotherized" });
  }

  //checkig if blacklisttoken contain the token or not
  const isBlackListed=await blackListTokenModel.findOne({token});
  if(isBlackListed){
    return res.status(401).json({message:"Unotherized"})
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);
    req.captain = captain;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unotherized second" });
  }
};

export default captainAuth;
