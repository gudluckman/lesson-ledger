import express from "express";
import { getMe, loginWithGoogle, updateMe } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.route("/google").post(loginWithGoogle);
router.route("/me").get(requireAuth, getMe).patch(requireAuth, updateMe);

export default router;
