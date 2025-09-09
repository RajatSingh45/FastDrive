import { getRouteServices } from "./routeInfoServices.js";
import { getCoordinates } from "./coordinateService.js";
import rideModel from "../models/ridesModel.js";
import crypto from "crypto";

const rates = {
  car: {
    baseFare: 50,
    perKm: 15,
    perMinute: 2,
  },
  moto: {
    baseFare: 20,
    perKm: 10,
    perMinute: 1,
  },
  auto: {
    baseFare: 30,
    perKm: 12,
    perMinute: 1.5,
  },
};

///funtion to calculate fare
const calculateFare = (distance, duration, veichle) => {
  const fare =
    veichle.baseFare +
    (distance / 1000) * veichle.perKm +
    (duration / 60) * veichle.perMinute;

  return Math.round(fare);
};

//function to return all vehicals fare to show to user
const getAllVehicalsFare = async (pickup, drop) => {
  try {
    const pickupCoords = await getCoordinates(pickup);
    const dropCoords = await getCoordinates(drop);

    if (!pickupCoords || !dropCoords) {
      throw new Error("Invalid address provided");
    }

    const result = await getRouteServices(pickupCoords, dropCoords);
    if (!result?.distance || !result?.time) {
      throw new Error("No route found between locations");
    }

    const fares = {
      carFare: calculateFare(result.distance, result.time, rates.car),
      motoFare: calculateFare(result.distance, result.time, rates.moto),
      autoFare: calculateFare(result.distance, result.time, rates.auto),
    };

    return fares;
  } catch (error) {
    throw new Error(error);
  }
};

//funtion to get single vehiccal fare for creating ride
const getSingleVeichleFare = async (pickup, drop, veichleType) => {
  try {
    const pickupCoords = await getCoordinates(pickup);
    const dropCoords = await getCoordinates(drop);

    // console.log("pickupCoords:", pickupCoords);
    // console.log("dropCoords:", dropCoords);

    if (!pickupCoords || !dropCoords) {
      throw new Error("Invalid address provided");
    }

    const result = await getRouteServices(pickupCoords, dropCoords);
    if (!result?.distance || !result?.time) {
      throw new Error("No route found between locations");
    }

    // console.log("distance:",result.distance)
    // console.log("time:",result.time)
    // console.log("vt:",veichleType)
    const fare = calculateFare(
      result.distance,
      result.time,
      rates[veichleType]
    );

    // console.log("Final fare:", fare);

    if (isNaN(fare)) {
      throw new Error(`Invalid fare calculation: ${fare}`);
    }
    return fare;
  } catch (error) {
    throw new Error(error);
  }
};

//funtion to gennrate otp
const getOtp = (num) => {
  const otp = crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
    .toString();
  return otp;
};

//create ride
const createRide = async (user, pickup, drop, veichleType) => {
  if (!user || !pickup || !drop || !veichleType)
    throw new Error("All feilds are required");

  try {
    const fare = await getSingleVeichleFare(pickup, drop, veichleType);
    // console.log("Calculated fare:", fare);

    const otp = getOtp(6);
    const ride = await rideModel.create({
      user,
      pickup,
      drop,
      fare,
      otp,
    });
    return ride;
  } catch (error) {
    throw new Error(error.message);
  }
};

//confirm ride
const confirmRideService = async (rideId, captainId) => {
  if (!rideId) throw new Error("rideId is required to update ride");

  if (!captainId) throw new Error("captain is required to update ride");

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captainId,
    }
  );

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) throw new Error("ride not updated");

  return ride;
};

//start ride
const startRideService = async ({rideId, otp,captain}) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId, status:"accepted"
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  //  console.log("ride otp:",ride.otp, typeof ride.otp);
  //  console.log("curr otp:",otp, typeof otp);
  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== Number(otp)) {
    throw new Error("Invalid OTP");
  }

  // const updatedRide=await rideModel
  //   .findOneAndUpdate(
  //     { _id: rideId },
  //     {
  //       status: "ongoing",
  //     },
  //     { new: true }
  //   )
  //   .populate("user")
  //   .populate("captain");

  
  ride.status="ongoing"
  await ride.save();
  console.log("ride in service:",ride)

  return ride;
};
export { createRide, getAllVehicalsFare, confirmRideService, startRideService };
