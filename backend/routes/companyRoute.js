import express from "express";
import {
  allCompanies,
  registerCompany,
} from "../controllers/companyController.js";
const router = express.Router();

router.route("/registerCompany").post(registerCompany).get(allCompanies);

export default router;
