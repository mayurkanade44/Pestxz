import express from "express";
import {
  addRecord,
  generateServiceReport,
} from "../controllers/reportController.js";
import { authorizeUser } from "../middleware/auth.js";
const router = express.Router();

router
  .route("/addRecord/:id")
  .post(authorizeUser("Admin", "Operator"), addRecord);
router.route("/allReports").get(authorizeUser("Admin"), generateServiceReport);

export default router;
