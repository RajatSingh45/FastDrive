import { getRouteServices } from "./routeInfoServices.js";
import getCoordinates from "./coordinateService.js";
import rideModel from "../models/ridesModel.js";
import crypto from "crypto";

const getFare = (distance, duration, veichleType) => {
  const rates = {
    car: {
      baseFare: 50,
      perKm: 15,
      perMinute: 2,
    },
    motorcycle: {
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

  const veichle = rates[veichleType.toLowerCase()];
  if (!veichle) {
    throw new Error("Invalid vehicle type");
  }

  const fare =
    veichle.baseFare +
    (distance / 1000) * veichle.perKm +
    (duration / 60) * veichle.perMinute;

  return fare;
};

const getOtp = (num) => {
  const otp = crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
    .toString();
  return otp;
};

const createRide = async (user, pickup, drop, veichleType) => {
  if (!user || !pickup || !drop || !veichleType)
    throw new Error("All feilds are required");

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

    const fare = getFare(result.distance, result.time, veichleType);
    console.log("Calculated fare:", fare);

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

export default createRide;
