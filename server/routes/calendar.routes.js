import express from "express";
import { google } from "googleapis";

const router = express.Router();

// Authenticate using the service account credentials
const jwtClient = new google.auth.JWT({
  email: process.env.CLIENT_EMAIL,
  keyFile: "./service_account.json",
  key: process.env.PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Initialize Google Calendar API
const calendar = google.calendar({ version: "v3", auth: jwtClient });

// Route to fetch weekly events from Google Calendar
router.get("/events", async (req, res) => {
  try {
    // Calculate the start of the current week (Monday) at 00:00:00
    const today = new Date();
    // console.log(`Today, day is ${today.getDay()}, date is ${today.getDate()}`);

    const isSunday = today.getDay() === 0;
    let startOfWeek;
    let endOfWeek;

    if (isSunday) {
      // console.log(`Today is Sunday, so end of week is today`);
      startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6); // Go back 6 days from today to reach Monday
      startOfWeek.setHours(0, 0, 0, 0); // Set to 00:00:00
      endOfWeek = new Date(today); // Create a new instance for today
    } else {
      // console.log(
      //   `Today is not Sunday, so start of week is ${
      //     today.getDate() - today.getDay() + 1
      //   }`
      // );
      startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Go back to Monday of the current week
      startOfWeek.setHours(0, 0, 0, 0); // Set to 00:00:00
      // console.log(`START OF WEEK: ${startOfWeek.getDate()}`);

      // console.log(
      //   `Today is not Sunday, so end of week is ${
      //     today.getDate() + (7 - today.getDay())
      //   }`
      // );
      endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Go forward to Sunday of the current week
      endOfWeek.setHours(23, 59, 59, 999); // Set to 23:59:59
      // console.log(`END OF WEEK: ${endOfWeek.getDate()}`);
    }

    console.log(
      `Start of the week: ${startOfWeek.toDateString()} ${startOfWeek.toTimeString()}`
    );
    console.log(
      `End of the week: ${endOfWeek.toDateString()} ${endOfWeek.toTimeString()}`
    );

    // Store start of the week date in localStorage

    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: startOfWeek.toISOString(),
      timeMax: endOfWeek.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items.filter(
      (event) => event.colorId === "1" || event.colorId === "9"
    );

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
