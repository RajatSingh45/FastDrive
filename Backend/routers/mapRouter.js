import express from "express";
const mapRouter = express.Router();
import { routesController,suggestionController} from "../controller/mapController.js";
import userAuth from "../middleware/userAuth.js";

mapRouter.post("/get-coordinates", userAuth, routesController);
mapRouter.get ("/get-suggestions",userAuth,suggestionController);


export default mapRouter;
