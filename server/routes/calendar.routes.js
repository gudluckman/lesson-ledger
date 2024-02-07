import express from "express";
import { google } from "googleapis";

const router = express.Router();

// Authenticate using the service account credentials
const jwtClient = new google.auth.JWT({
  email: process.env.CLIENT_EMAIL,
  keyFile: './service_account.json',
  key: process.env.PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Initialize Google Calendar API
const calendar = google.calendar({ version: "v3", auth: jwtClient });

// Route to fetch events from Google Calendar
router.get("/events", async (req, res) => {
  try {
    console.log("Request received to fetch events");

    // Calculate the start of the current week (Monday)
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate the end of the current week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: startOfWeek.toISOString(),
      timeMax: endOfWeek.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    console.log("Events fetched successfully");

    const events = response.data.items.filter(event => event.colorId === "1" || event.colorId === "9");

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
