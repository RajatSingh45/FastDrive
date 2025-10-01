import {
  getCoordinates,
  getNearByCaptains,
} from "../services/coordinateService.js";
import {
  confirmRideService,
  createRide,
  endRideService,
  getAllVehicalsFare,
  startRideService,
} from "../services/rideService.js";
import { validationResult } from "express-validator";
import { sendMessageToSocketId } from "../socket/socket.js";
import rideModel from "../models/ridesModel.js";

const rideController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, drop, veichleType } = req.body;

    if (!pickup || !drop || !veichleType)
      return res.status(500).json({ error: "All feilds are required" });

    const user = req.user?._id;
    if (!user) return res.status(500).json({ error: "user is unautherized" });

    const ride = await createRide(user, pickup, drop, veichleType);
    if (!ride) return res.status(500).json({ error: "ride not created" });

    // res.status(201).json({ ride });

    const pickupCoords = await getCoordinates(pickup);
    const dropCoords = await getCoordinates(drop);

    // console.log("pickupCoords in controller:", pickupCoords);

    if (!pickupCoords || pickupCoords.length < 2) {
      return res
        .status(500)
        .json({ error: "Could not resolve pickup coordinates" });
    }

    if (!dropCoords || dropCoords.length < 2) {
      return res
        .status(500)
        .json({ error: "Could not resolve drop coordinates" });
    }
    //  console.log("drop and dropCoords in controller:",drop,dropCoords)

    const pickupLatLng = [pickupCoords[1], pickupCoords[0]];
    const dropLatLng = [dropCoords[1], dropCoords[0]];
    // Use array indices for lng and lat
    const captainsAvialable = await getNearByCaptains(
      pickupCoords[0],
      pickupCoords[1],
      5
    );

    // console.log("cpatins in controller:",captainsAvialable);

    if (captainsAvialable.length === 0) {
      // Optionally update ride status in DB here
      return res.status(201).json({
        ride,
        message: "No captains available nearby. Your ride is pending.",
      });
    }

    ride.otp = ""; //captain should not get the otp before reaching the user

    const User = await rideModel.findOne({ _id: ride._id }).populate("user");
    // console.log("user in controller:",User)
    // console.log("drop in controller:",ride)
    captainsAvialable.forEach((captain) => {
      sendMessageToSocketId(captain.socketId, "new-ride", {
        User,
        pickupCoords:pickupLatLng,
        dropCoords:dropLatLng,
      });
    });

    // console.log(rideWithUser)

    return res.status(201).json({
      User,
      message: "Ride request sent to nearby captains",
    });
  } catch (error) {
    console.log("ride creation failed:", error);
    return res.status(500).json({ error: "something went wrong" });
  }
};

const fareController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, drop } = req.query;

  if (!pickup || !drop) {
    return res.status(500).json({ error: "Required both address" });
  }

  console.log("pickup and drop in fare:", pickup, drop);

  try {
    const fares = await getAllVehicalsFare(pickup, drop);
    return res.status(200).json(fares);
  } catch (error) {
    console.log("unable to fetch fare:", error);
    return res.status(400).json({ error: "something went wrong" });
  }
};

const confirmRide = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, captainId } = req.body;

    const ride = await confirmRideService(rideId, captainId);

    sendMessageToSocketId(ride.user.socketId, "ride-confirm", ride);

    return res.status(200).json(ride);
  } catch (error) {
    console.log("error during confirm ride backend", error);
    return res.status(500).json({ message: error.message });
  }
};

const startRide = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.body;
    // console.log("rideId in controller:",rideId)
    // console.log("otp in controller:",otp);

    // const currRide=await rideModel.findById(rideId);
    // console.log("ride:",currRide);

    const ride = await startRideService({ rideId, otp, captain: req.captain });
    // console.log("ride in controler after updating in service:",ride);

    // console.log("ride in controller:", ride);

    sendMessageToSocketId(ride.user.socketId, "ride-started", ride);

    return res.status(200).json({ ride });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const endRide = async (req, res) => {
  try {
    console.log(req.captain);

    if (!req.captain) {
      console.error("End Ride failed: Captain authentication object missing.");
      return res
        .status(401)
        .json({ message: "Authentication required. Please log in again." });
    }

    // console.log("captain;",req.captain)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    // console.log("rideId:",rideId);
    // console.log("captian:",captain);

    const ride = await endRideService({ rideId, captain: req.captain });

    console.log("ride in controler:", ride);

    sendMessageToSocketId(ride.user.socketId, "ride-ended", ride);

    return res.status(200).json({ ride });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { rideController, fareController, confirmRide, startRide, endRide };
