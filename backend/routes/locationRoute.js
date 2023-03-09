import express from "express";
import { addLocation, editLocation, getLocationServices, getSingleShipTo } from "../controllers/locationController.js";
const router = express.Router();

router.route("/addLocation/:id").post(addLocation);
router.route("/locationServices/:id").get(getLocationServices).patch(editLocation);
router.route("/singleShipTo/:id").get(getSingleShipTo)

export default router;
