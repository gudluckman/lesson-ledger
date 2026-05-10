import express from "express";
import {
  fetchNextWeeklyEvents,
  fetchPreviousWeeklyEvents,
  fetchWeeklyEvents,
  updateLessonPayment,
} from "../controllers/calendar.controller";

const router = express.Router();

// Route to fetch weekly events from Google Calendar
router.get("/events", fetchWeeklyEvents);
router.get("/past-events", fetchPreviousWeeklyEvents);
router.get("/future-events", fetchNextWeeklyEvents);
router.patch("/events/:eventId/paid", updateLessonPayment);

export default router;
