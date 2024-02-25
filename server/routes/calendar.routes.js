import express from "express";
import { fetchWeeklyEvents } from "../controllers/calendar.controller.js";

const router = express.Router();

// Route to fetch weekly events from Google Calendar
router.get("/events", fetchWeeklyEvents);

export default router;
