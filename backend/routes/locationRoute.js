import express from "express";
import { addLocation, editLocation, getLocationServices } from "../controllers/locationController.js";
const router = express.Router();

router.route("/addLocation/:id").post(addLocation);
router.route("/locationServices/:id").get(getLocationServices).patch(editLocation);

export default router;
