import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  veichle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "color must be of atleast three cahrectors"],
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "plate number must of three charetors"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Atleast capacity of one person is required"],
    },
    veichleType: {
      type: String,
      required: true,
      enum: ["car", "motorcycle", "auto"],
    },
  },
    location: {
      lat: {
        type: Number,
      },
      lon: {
        type: Number,
      },
  }
});

//creating the authtoken
captainSchema.methods.genrateJwtToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

//hashing the password
captainSchema.statics.hashPasswword = async function (password) {
  return await bcrypt.hash(password, 10);
};

//comparing the password
captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const captainModel = mongoose.model("captain", captainSchema);
export default captainModel;
