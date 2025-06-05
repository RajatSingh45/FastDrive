import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import captainModel from "../models/captainModel.js";
import blackListTokenModel from "../models/blackListTokenModel.js";

const captainAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

  // console.log("Authorization Header:", authHeader);
  // console.log("Token received in middleware:", token);

  if (!token) {
    return res.status(401).json({ message: "Unotherized" });
  }

  //checkig if blacklisttoken contain the token or not
  const isBlackListed = await blackListTokenModel.findOne({ token });
  // console.log("Is blacklisted?", isBlackListed);

  const allTokens = await blackListTokenModel.find({});
  // console.log("All blacklist tokens:", allTokens); // ✅ Step 3

  if (isBlackListed) {
    return res.status(401).json({ message: "Unotherized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded); // ✅ Step 2

    const captain = await captainModel.findById(decoded._id);
    // console.log("Captain from DB:", captain); // ✅ Step 2
    req.captain = captain;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unotherized second" });
  }
};

export default captainAuth;
