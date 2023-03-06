import express from "express";
import { addShipTo } from "../controllers/shipToController.js";
const router = express.Router();

router.route("/addShipTo").post(addShipTo);

export default router;
