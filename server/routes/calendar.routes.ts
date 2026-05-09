import express from "express";
import { fetchNextWeeklyEvents, fetchWeeklyEvents } from "../controllers/calendar.controller.js";

const router = express.Router();

// Route to fetch weekly events from Google Calendar
router.get("/events", fetchWeeklyEvents);
router.get("/future-events", fetchNextWeeklyEvents);

export default router;
