import userModel from "../models/userModel.js";
import { validationResult } from "express-validator";
import blackListTokenModel from '../models/blackListTokenModel.js'

const userRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    //checking all fields
    if (!fullname.firstname || !email || !password) {
       return res.status(400).json({ success: false, message: "All fields are required" });
    }

    //checking firstname,email and password is validate odr not using express-validator
    const validateError = validationResult(req);
    if (!validateError.isEmpty()) {
      return res.json({ message: validateError.array() });
    }

    //checking if user already exist or not
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.json({ message: "user already exists!" });
    }

    //hashing the password
    const hashedPasswword = await userModel.hashPasswword(password);

    //create new user
    const user = await userModel.create({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email,
      password: hashedPasswword,
    });

    //genrating token
    const token = user.genrateJwtToken();

    res.status(201).json({ success: true, token, user });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const userLogin = async (req,res) => {
    try {
        const validateError = validationResult(req);
    if (!validateError.isEmpty()) {
      return res.json({ message: message.array() });
    }
     
    const {email,password}=req.body;
    //checking if user exists or not
    const user=await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message:"Invalid email or password"});
    }

    const decodedPassword=await user.comparePassword(password);
    if(!decodedPassword){
        return res.status(401).json({message:"Invalid email or password"});
    }

    //genrate token
    const token=user.genrateJwtToken();
    res.cookie('token',token)
    // console.log(cookie)

    // console.log("user in backend:",user);

    res.status(201).json({success:true,token,user});
    } catch (error) {
        // console.log(error);
        res.status(400).json({success:false,message:error.message});
    }
};

const userLogout = async (req,res) => {
  console.log("hit backend")
         res.clearCookie('token');

         const token=req.cookies?.token||req.headers.authorization?.split(' ')[1];

         console.log("recieved token in logout controller:",token);

         await blackListTokenModel.create({token});

         res.status(200).json({message:"Logout Succesfully"});
};

const userProfile=async (req,res)=>{
     res.json(req.user)
}

export { userRegister, userLogin, userLogout, userProfile };
