import createRide from "../services/rideService.js";
import {validationResult} from 'express-validator' 

const rideController=async (req,res)=>{

    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }


    const {pickup,drop,veichleType}=req.body;

    if(!pickup||!drop||!veichleType)
      return res.status(500).json({error:"All feilds are required"});

    const user=req.user?._id;
    if(!user)
        return res.status(500).json({error:"user is unautherized"})

     try {
         const ride=await createRide(user,pickup,drop,veichleType);
         if(!ride)
          return res.status(500).json({error:"ride not get"});
        
         return res.status(201).json({ride});        
     } catch (error) {
        console.log("ride creation failed:",error);
        return res.status(400).json({error:"something went wrong"});
     }

}

export default rideController