import { Server, Socket } from "socket.io";
import userModel from "../models/userModel.js";
import captainModel from "../models/captainModel.js";

let io;

const intializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // console.log(`New user with socketId ${socket.id} connected`);

    //UPDATE SOCKETID BASED ON USER TYPE
    socket.on("join", async (data) => {
      const {userId,userType}=data;
      console.log(`New ${userType} with socket id ${socket.id} has joined server`)
      if (userType === "user") {
         console.log("user id:",userId);
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    //UPDATE CAPTAIN LOCATION EVERY 15SEC
    socket.on("update-captain-loc", async (data) => {
      const {userId,location}=data;

      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Invalid location" });
      }

      //update the cpatain location in db
      // console.log("hit update location function")
      await captainModel.findByIdAndUpdate(userId, {
        location: { lat: location.lat, lng: location.lng },
      });
    });

    socket.on("disconnect", () => {
      console.log(`User with socketId ${socket.id} disconnected`);
    });
  });
};

const sendMessageToSocketId = (socketId, eventName, data) => {
  if (io) {
    io.to(socketId).emit(eventName, data);
  } else {
    console.log("sockect is not intialized");
  }
};

export { intializeSocket, sendMessageToSocketId };
