import express from "express";
import {
  addShipTo,
  deleteShipTo,
  getAllComplaints,
  updateComplaint,
  updateShipTo,
} from "../controllers/shipToController.js";
const router = express.Router();

router.route("/client").post(addShipTo);
router.route("/client/:id").patch(updateShipTo).delete(deleteShipTo);
router.route("/complaints/:id").get(getAllComplaints).put(updateComplaint)

export default router;
