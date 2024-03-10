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
    // Calculate the start of the current week (Monday) at 00:00:00
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

    // console.log(
    //   `Start of the week: ${startOfWeek.toDateString()} ${startOfWeek.toTimeString()}`
    // );
    // console.log(
    //   `End of the week: ${endOfWeek.toDateString()} ${endOfWeek.toTimeString()}`
    // );

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
};

export { fetchWeeklyEvents };
