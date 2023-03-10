import express from "express";
import {
  addService,
  editService,
  getCompanyServices,
} from "../controllers/adminController.js";

const router = express.Router();

router.route("/service").post(addService).get(getCompanyServices);
router.route("/service/;id").patch(editService);

export default router;
