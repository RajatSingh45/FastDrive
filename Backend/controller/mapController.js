import getCoordinates from "../services/coordinateService.js";
import { getRouteServices,getSuggestions } from "../services/routeinfoServices.js";

const routesController = async (req, res) => {
  const { pickup, drop } = req.body;
  const pickupCoords = await getCoordinates(pickup);
  const dropCoords = await getCoordinates(drop);

  if (!pickupCoords || !dropCoords) {
    return res.status(400).json({ error: "Invalid address provided" });
  }

  try {
    const result = await getRouteServices(pickupCoords, dropCoords);
    //  console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch route" });
  }
}

const suggestionController=async (req,res)=>{
    const {input}=req.query

    try {
        const suggestion=await getSuggestions(input)
        
        res.status(200).json(suggestion)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }
}

export { routesController,suggestionController }
