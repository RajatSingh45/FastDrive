import { getCoordinates, getNearByCaptains } from "../services/coordinateService.js";
import { createRide, getAllVehicalsFare } from "../services/rideService.js";
import { validationResult } from "express-validator";
import { sendMessageToSocketId } from "../socket/socket.js";

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

    console.log("pickupCoords in controller:", pickupCoords);

    if (!pickupCoords || pickupCoords.length < 2) {
      return res.status(500).json({ error: "Could not resolve pickup coordinates" });
    }

    // Use array indices for lng and lat
    const captainsAvialable = await getNearByCaptains(pickupCoords[0], pickupCoords[1], 5);

    // console.log("cpatins in controller:",captainsAvialable);

    if (captainsAvialable.length === 0) {
      // Optionally update ride status in DB here
      return res.status(201).json({
        ride,
        message: "No captains available nearby. Your ride is pending.",
      });
    }

    ride.otp = ""; //captain should not get the otp before reaching the user

    captainsAvialable.forEach((captain) => {
      sendMessageToSocketId(captain.socketId, "new-ride", ride);
    });

    return res.status(201).json({
      ride,
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

  try {
    const fares = await getAllVehicalsFare(pickup, drop);
    return res.status(200).json(fares);
  } catch (error) {
    console.log("unable to fetch fare:", error);
    return res.status(400).json({ error: "something went wrong" });
  }
};

export { rideController, fareController };
