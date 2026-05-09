import express from "express";
import { getYearlyEarning } from "../controllers/yearly_earning.controller";

const router = express.Router();

router.route("/").get(getYearlyEarning);

export default router;