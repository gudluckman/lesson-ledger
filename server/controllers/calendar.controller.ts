import { calendar_v3, google } from "googleapis";
import { Request, Response } from "express";
import LessonPayment from "../mongodb/models/lesson_payment";

const calendarScopes = ["https://www.googleapis.com/auth/calendar.readonly"];
const calendarTimeZone = process.env.CALENDAR_TIME_ZONE || "Australia/Sydney";

const normalizePrivateKey = (privateKey?: string) => {
  if (!privateKey) {
    return undefined;
  }

  return privateKey
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\\n/g, "\n");
};

const parseServiceAccountJson = (credentials?: string) => {
  if (!credentials) {
    return undefined;
  }

  const normalizedCredentials = credentials.trim();
  const json = normalizedCredentials.startsWith("{")
    ? normalizedCredentials
    : Buffer.from(normalizedCredentials, "base64").toString("utf8");

  const parsed = JSON.parse(json) as {
    client_email?: string;
    private_key?: string;
  };

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      "Google service account JSON must include client_email and private_key"
    );
  }

  return {
    email: parsed.client_email,
    key: normalizePrivateKey(parsed.private_key),
  };
};

const getGoogleCalendarAuthConfig = () => {
  const serviceAccountCredentials =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 ||
    process.env.GOOGLE_CREDENTIALS_BASE64;
  const serviceAccountConfig = parseServiceAccountJson(
    serviceAccountCredentials
  );

  if (serviceAccountConfig) {
    return serviceAccountConfig;
  }

  const privateKey = normalizePrivateKey(
    process.env.PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY
  );
  const clientEmail =
    process.env.CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;

  if (privateKey && clientEmail) {
    return {
      email: clientEmail,
      key: privateKey,
    };
  }

  return {
    keyFile:
      process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service_account.json",
  };
};

const getCalendarClient = () => {
  const jwtClient = new google.auth.JWT({
    ...getGoogleCalendarAuthConfig(),
    scopes: calendarScopes,
  });

  return google.calendar({ version: "v3", auth: jwtClient });
};

const getRequestCalendarId = (req: Request) => req.user?.calendarId?.trim();

const lessonPricePattern = /^\s*\$\d+(?:\.\d{1,2})?\b/;

const getLessonEvents = (events: calendar_v3.Schema$Event[] = []) =>
  events.filter(
    (event) =>
      event.id &&
      event.start?.dateTime &&
      event.end?.dateTime &&
      lessonPricePattern.test(event.description ?? "")
  );

const withPaymentStatus = async (
  req: Request,
  events: calendar_v3.Schema$Event[]
) => {
  if (!req.user || events.length === 0) {
    return events;
  }

  const eventIds = events
    .map((event) => event.id)
    .filter((eventId): eventId is string => Boolean(eventId));
  const lessonPayments = await LessonPayment.find({
    tutor: req.user._id,
    googleEventId: { $in: eventIds },
  });
  const paidEventIds = new Set(
    lessonPayments
      .filter((lessonPayment) => lessonPayment.paid)
      .map((lessonPayment) => lessonPayment.googleEventId)
  );

  return events.map((event) => ({
    ...event,
    paid: event.id ? paidEventIds.has(event.id) : false,
  }));
};

const zonedFormatterCache = new Map<string, Intl.DateTimeFormat>();

const getZonedFormatter = (timeZone: string) => {
  const cachedFormatter = zonedFormatterCache.get(timeZone);

  if (cachedFormatter) {
    return cachedFormatter;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  zonedFormatterCache.set(timeZone, formatter);

  return formatter;
};

const getZonedDateParts = (date: Date, timeZone: string) => {
  const parts = getZonedFormatter(timeZone).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
};

const getTimeZoneOffsetMs = (date: Date, timeZone: string) => {
  const parts = getZonedDateParts(date, timeZone);
  const zonedTimeAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  const utcTimeWithoutMs = Math.floor(date.getTime() / 1000) * 1000;

  return zonedTimeAsUtc - utcTimeWithoutMs;
};

const zonedDateTimeToUtc = (
  date: Date,
  timeZone: string,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
) => {
  const wallTimeAsUtc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    hours,
    minutes,
    seconds,
    milliseconds
  );
  const guessedUtcTime =
    wallTimeAsUtc - getTimeZoneOffsetMs(new Date(wallTimeAsUtc), timeZone);
  const correctedUtcTime =
    wallTimeAsUtc - getTimeZoneOffsetMs(new Date(guessedUtcTime), timeZone);

  return new Date(correctedUtcTime);
};

const getWeekRange = (offsetWeeks = 0, now = new Date()) => {
  const todayInCalendarTimeZone = getZonedDateParts(
    now,
    calendarTimeZone
  );
  const calendarDate = new Date(
    Date.UTC(
      todayInCalendarTimeZone.year,
      todayInCalendarTimeZone.month - 1,
      todayInCalendarTimeZone.day
    )
  );
  const day = calendarDate.getUTCDay();
  const daysFromMonday = day === 0 ? -6 : 1 - day;
  const weekStartDate = new Date(calendarDate);

  weekStartDate.setUTCDate(
    calendarDate.getUTCDate() + daysFromMonday + offsetWeeks * 7
  );

  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 6);

  return {
    startOfWeek: zonedDateTimeToUtc(
      weekStartDate,
      calendarTimeZone,
      0,
      0,
      0,
      0
    ),
    endOfWeek: zonedDateTimeToUtc(
      weekEndDate,
      calendarTimeZone,
      23,
      59,
      59,
      999
    ),
  };
};

const fetchEventsForWeek = async (
  req: Request,
  res: Response,
  offsetWeeks = 0
) => {
  try {
    const calendarId = getRequestCalendarId(req);
    if (!calendarId) {
      return res.json([]);
    }

    const { startOfWeek, endOfWeek } = getWeekRange(offsetWeeks);

    console.log(
      `Start of requested week: ${startOfWeek.toISOString()} (${calendarTimeZone})`
    );
    console.log(
      `End of requested week: ${endOfWeek.toISOString()} (${calendarTimeZone})`
    );

    const response = await getCalendarClient().events.list({
      calendarId,
      timeMin: startOfWeek.toISOString(),
      timeMax: endOfWeek.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
      fields: "items(id,summary,start,end,hangoutLink,description)",
    });

    const events = await withPaymentStatus(
      req,
      getLessonEvents(response.data.items)
    );

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchWeeklyEvents = async (req: Request, res: Response) =>
  fetchEventsForWeek(req, res);

const fetchPreviousWeeklyEvents = async (req: Request, res: Response) =>
  fetchEventsForWeek(req, res, -1);

const fetchNextWeeklyEvents = async (req: Request, res: Response) => {
  fetchEventsForWeek(req, res, 1);
};

const updateLessonPayment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { eventId } = req.params;
    const { paid } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Google event id is required" });
    }

    const lessonPayment = await LessonPayment.findOneAndUpdate(
      {
        tutor: req.user._id,
        googleEventId: eventId,
      },
      {
        paid: Boolean(paid),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      googleEventId: lessonPayment.googleEventId,
      paid: lessonPayment.paid,
    });
  } catch (error) {
    console.error("Error updating lesson payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  fetchNextWeeklyEvents,
  fetchPreviousWeeklyEvents,
  fetchWeeklyEvents,
  getWeekRange,
  updateLessonPayment,
};
