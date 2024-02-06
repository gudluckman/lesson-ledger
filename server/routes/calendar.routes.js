import express from "express";
import { google } from "googleapis";

const router = express.Router();

// Authenticate using the service account credentials
const jwtClient = new google.auth.JWT({
  email: process.env.CLIENT_EMAIL,
  key: process.env.PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Initialize Google Calendar API
const calendar = google.calendar({ version: "v3", auth: jwtClient });

// Route to fetch events from Google Calendar
router.get("/events", async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = response.data.items;
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
