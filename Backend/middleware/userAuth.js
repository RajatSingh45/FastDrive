import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import blackListTokenModel from '../models/blackListTokenModel.js'

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);
//   console.log(req.cookies.token)
   console.log("Received token in middleware:", token);

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
    const user = await userModel.findById(decoded._id);
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unotherized second" });
  }
};

export default userAuth;
