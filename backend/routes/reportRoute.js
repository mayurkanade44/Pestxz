import express from "express";
import { addRecord, getServiceReport } from "../controllers/reportController.js";
const router = express.Router();

router.route("/addRecord/:id").post(addRecord);
router.route("/allReports").get(getServiceReport);

export default router;
