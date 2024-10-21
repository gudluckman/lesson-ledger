import { google } from "googleapis";

// Authenticate using the service account credentials
const jwtClient = new google.auth.JWT({
  email: process.env.CLIENT_EMAIL,
  keyFile: "./service_account.json",
  key: process.env.PRIVATE_KEY.split(String.raw`\n`).join("\n"),
  // key: process.env.PRIVATE_KEY, // Uncomment this for testing
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Initialize Google Calendar API
const calendar = google.calendar({ version: "v3", auth: jwtClient });

// Function to fetch weekly events from Google Calendar
const fetchWeeklyEvents = async (req, res) => {
  try {
    const today = new Date();
    const isSunday = today.getDay() === 0;
    let startOfWeek;
    let endOfWeek;

    if (isSunday) {
      startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);
      endOfWeek = new Date(today);
      endOfWeek.setHours(23, 59, 59, 999);
    } else {
      startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Go back to Monday of the current week
      startOfWeek.setHours(0, 0, 0, 0); // Set to 00:00:00
      endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Go forward to Sunday of the current week
      endOfWeek.setHours(23, 59, 59, 999); // Set to 23:59:59
    }

    console.log(
      `Start of the week: ${startOfWeek.toDateString()} ${startOfWeek.toTimeString()}`
    );
    console.log(
      `End of the week: ${endOfWeek.toDateString()} ${endOfWeek.toTimeString()}`
    );

    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: startOfWeek.toISOString(),
      timeMax: endOfWeek.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
      fields: "items(colorId,summary,start,end,hangoutLink,description,attachments)",
    });

    const events = response.data.items.filter(
      (event) => event.colorId === "1" || event.colorId === "9"
    );

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchNextWeeklyEvents = async (req, res) => {
  try {
    const today = new Date();
    const isSunday = today.getDay() === 0;
    let startOfNextWeek;
    let endOfNextWeek;

    if (isSunday) {
      startOfNextWeek = new Date(today);
      startOfNextWeek.setDate(today.getDate() - 6);
      startOfNextWeek.setHours(0, 0, 0, 0);
      endOfNextWeek = new Date(today);
      endOfNextWeek.setHours(23, 59, 59, 999);
    } else {
      startOfNextWeek = new Date(today);
      startOfNextWeek.setDate(today.getDate() - today.getDay() + 8); // Go back to Monday of the next week
      startOfNextWeek.setHours(0, 0, 0, 0); // Set to 00:00:00
      endOfNextWeek = new Date(today);
      endOfNextWeek.setDate(today.getDate() + (14 - today.getDay())); // Go forward to Sunday of the next week
      endOfNextWeek.setHours(23, 59, 59, 999); // Set to 23:59:59
    }

    console.log(
      `Start of the next week: ${startOfNextWeek.toDateString()} ${startOfNextWeek.toTimeString()}`
    );
    console.log(
      `End of the next week: ${endOfNextWeek.toDateString()} ${endOfNextWeek.toTimeString()}`
    );

    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: startOfNextWeek.toISOString(),
      timeMax: endOfNextWeek.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
      fields: "items(colorId,summary,start,end,hangoutLink,description,attachments)",
    });

    const events = response.data.items.filter(
      (event) => event.colorId === "1" || event.colorId === "9"
    );

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { fetchWeeklyEvents, fetchNextWeeklyEvents };