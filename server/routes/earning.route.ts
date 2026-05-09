import express from "express";

import {
  createEarning,
  deleteEarning,
  getAllEarnings,
  rebuildYearlyEarnings,
  updateEarnings,
} from "../controllers/earning.controller";

const router = express.Router();

router.route("/").get(getAllEarnings);
router.route("/").post(createEarning);
router.route("/rebuild-yearly").post(rebuildYearlyEarnings);
router.route("/:id").delete(deleteEarning);
router.route("/:id").patch(updateEarnings);

export default router;
