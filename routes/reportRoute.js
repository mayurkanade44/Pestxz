import express from "express";
import {
  addComplaint,
  getLocationServices,
} from "../controllers/locationController.js";
import {
  addRecord,
  generateServiceReport,
} from "../controllers/reportController.js";
import { authenticateUser, authorizeUser } from "../middleware/auth.js";
const router = express.Router();

router
  .route("/allReports")
  .get(authenticateUser, authorizeUser("Admin"), generateServiceReport);

router
  .route("/addRecord/:id")
  .post(authenticateUser, authorizeUser("Admin", "Operator"), addRecord);

router.post("/newComplaint/:id", addComplaint);

router.route("/locationServices/:id").get(getLocationServices);

export default router;
