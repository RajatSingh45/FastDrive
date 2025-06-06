import captainModel from "../models/captainModel.js";
import { validationResult } from "express-validator";
import blackListTokenModel from "../models/blackListTokenModel.js";

const captainRegister = async (req, res) => {
  try {
    const { fullname, email, password, veichle } = req.body;

    //check all field
    if (
      !fullname.firstname ||
      !email ||
      !password ||
      !veichle.color ||
      !veichle.plate ||
      !veichle.capacity ||
      !veichle.veichleType
    ) {
      return res.json({ message: "All fields are required" });
    }

    //check validation
    const validateError = validationResult(req);
    if (!validateError.isEmpty()) {
      return res.json({ success: false, message: validateError.array() });
    }

    //checking if captain already exist or not
    const captainExist = await captainModel.findOne({ email });
    if (captainExist) {
      return res.json({ message: "captain already exists!" });
    }

    //hashing the password
    const hashedPasswword = await captainModel.hashPasswword(password);

    //create new captain
    const captain = await captainModel.create({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email,
      password: hashedPasswword,
      veichle: {
        color: veichle.color,
        plate: veichle.plate,
        capacity: veichle.capacity,
        veichleType: veichle.veichleType,
      },
    });

    //genrating token
    const token = captain.genrateJwtToken();

    res.status(201).json({ success: true, token, captain });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const captainLogin = async (req, res) => {
  try {
    const validateError = validationResult(req);
    if (!validateError.isEmpty()) {
      return res.json({ success: false, message: validateError.array() });
    }

    const { email, password } = req.body;
    //checking if captain exists or not
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const decodedPassword = await captain.comparePassword(password);
    if (!decodedPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //genrate token
    const token = captain.genrateJwtToken();
    res.cookie("token", token);
    // console.log(cookie)

    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const captainProfile = async (req, res) => {
  res.status(200).json(req.captain);
};

const captainLogout = async (req, res) => {
  // console.log("in logout controller backend!")
  res.clearCookie("token");

  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  // console.log("Backend received token:", token); // Debug log
  await blackListTokenModel.updateOne(
      { token },
      { $setOnInsert: { token } },
      { upsert: true }
    );

  res.status(200).json({ message: "Logout Succesfully" });
};

export { captainRegister, captainLogin, captainProfile, captainLogout };
