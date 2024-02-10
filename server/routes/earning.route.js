import express from "express";

import {
  createEarning,
  deleteEarning,
  getAllEarnings,
  updateEarnings,
} from "../controllers/earning.controller.js";

const router = express.Router();

router.route("/").get(getAllEarnings);
router.route("/").post(createEarning);
router.route("/:id").delete(deleteEarning);
router.route("/:id").patch(updateEarnings);

export default router;
