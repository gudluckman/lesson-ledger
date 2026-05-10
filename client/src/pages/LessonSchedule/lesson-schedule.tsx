import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { Helmet } from "react-helmet";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import { CustomButton } from "components";
import { Stack } from "@pankod/refine-mui";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PaidIcon from "@mui/icons-material/Paid";
import VideocamIcon from "@mui/icons-material/Videocam";
import { API_BASE_URL } from "utils/api";
import { getAuthHeaders } from "utils/auth";

const lessonPricePattern = /^\s*(\$\d+(?:\.\d{1,2})?)\b/;
const lessonDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  const daysFromMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  const sunday = new Date(today);

  monday.setDate(today.getDate() + daysFromMonday);
  sunday.setDate(monday.getDate() + 6);

  return {
    monday: formatDateInputValue(monday),
    sunday: formatDateInputValue(sunday),
  };
};

const LessonSchedule: React.FC = () => {
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [nextEvents, setNextEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleView, setScheduleView] = useState<
    "past" | "current" | "next"
  >("current");
  const [calendarId, setCalendarId] = useState("");
  const [serviceAccountEmail, setServiceAccountEmail] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupSaving, setSetupSaving] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [currentDay] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  );

  const baseURL = API_BASE_URL;
  const displayedEvents =
    scheduleView === "past"
      ? pastEvents
      : scheduleView === "current"
      ? events
      : nextEvents;

  const getLessonDetails = (description?: string) => {
    const cleanDescription = description || "";
    const price = cleanDescription.match(lessonPricePattern)?.[1] || "$0";
    const notes = cleanDescription.replace(lessonPricePattern, "").trim();

    return {
      price,
      priceValue: Number(price.replace("$", "")) || 0,
      notes,
    };
  };

  const getLessonDuration = (event: any) => {
    const start = new Date(event.start?.dateTime);
    const end = new Date(event.end?.dateTime);
    const durationInMs = end.getTime() - start.getTime();

    if (!Number.isFinite(durationInMs)) {
      return 0;
    }

    return Math.max(durationInMs / (1000 * 60 * 60), 0);
  };

  const displayedSummary = displayedEvents.reduce(
    (summary, event) => {
      const { priceValue } = getLessonDetails(event.description);

      return {
        hours: summary.hours + getLessonDuration(event),
        income: summary.income + priceValue,
      };
    },
    { hours: 0, income: 0 }
  );

  const fetchEvents = useCallback(async () => {
    try {
      const [pastResponse, currentResponse, nextResponse] = await Promise.all([
        axios.get(`${baseURL}/lessons/past-events`, {
          headers: getAuthHeaders(),
        }),
        axios.get(`${baseURL}/lessons/events`, {
          headers: getAuthHeaders(),
        }),
        axios.get(`${baseURL}/lessons/future-events`, {
          headers: getAuthHeaders(),
        }),
      ]);
      setPastEvents(pastResponse.data);
      setEvents(currentResponse.data);
      setNextEvents(nextResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  }, [baseURL]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const fetchCalendarSetup = async () => {
      try {
        const response = await axios.get(`${baseURL}/auth/me`, {
          headers: getAuthHeaders(),
        });
        const user = response.data;
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const nextUser = { ...storedUser, ...user };

        localStorage.setItem("user", JSON.stringify(nextUser));
        setCalendarId(user.calendarId || "");
        setServiceAccountEmail(user.calendarServiceAccountEmail || "");
        setSetupOpen(!user.calendarId);
      } catch (error) {
        console.error("Error fetching calendar setup:", error);
      }
    };

    fetchCalendarSetup();
  }, [baseURL]);

  // To get weekly's lesson details then display in dashboard via localStorage
  useEffect(() => {
    let totalSum = 0;
    let totalHours = 0;
    const studentsSet = new Set();

    events.forEach((event: any) => {
      const nameRegex = /^(.+)\s+\(/; // Extract name of student
      const matches = event.summary.match(nameRegex);
      if (matches && matches.length > 1) {
        const studentName = matches[1].trim();
        // Add the studentName to the Set
        studentsSet.add(studentName);
      }

      // Calculate duration in hours for each event
      totalHours += getLessonDuration(event);
    });

    // Get the size of the Set to get unique student count
    const eventCount = studentsSet.size;

    // Calculate total sum and average hourly rate
    totalSum = events.reduce((acc: number, event: any) => {
      return acc + getLessonDetails(event.description).priceValue;
    }, 0);

    localStorage.setItem("currentWeeklyIncomeSum", totalSum.toString());
    localStorage.setItem("currentWeeklyHours", totalHours.toString());
    localStorage.setItem("currentWeekStartDate", getCurrentWeekDates().monday);
    localStorage.setItem("currentWeekEndDate", getCurrentWeekDates().sunday);
    localStorage.setItem(
      "currentAverageHourlyRate",
      (totalHours > 0 ? totalSum / totalHours : 0).toString()
    );
    localStorage.setItem("currentWeeklyStudents", eventCount.toString());
  }, [events]);

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  const formatTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterEventsByDay = (day: string) => {
    return displayedEvents.filter(
      (event: any) => getDayOfWeek(event.start.dateTime) === day
    );
  };

  const formatHours = (hours: number) =>
    Number.isInteger(hours) ? hours.toString() : hours.toFixed(1);

  const openCalendarSetup = () => {
    setSetupError("");
    setSetupOpen(true);
  };

  const handleSaveCalendarId = async () => {
    const trimmedCalendarId = calendarId.trim();

    if (!trimmedCalendarId) {
      setSetupError("Enter your Google Calendar ID to sync your lessons.");
      return;
    }

    setSetupSaving(true);
    setSetupError("");

    try {
      const response = await axios.patch(
        `${baseURL}/auth/me`,
        { calendarId: trimmedCalendarId },
        { headers: getAuthHeaders() }
      );
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const nextUser = { ...storedUser, ...response.data };

      localStorage.setItem("user", JSON.stringify(nextUser));
      setCalendarId(response.data.calendarId || trimmedCalendarId);
      setSetupOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error("Error saving calendar ID:", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setSetupError(message || "Could not save your calendar ID.");
    } finally {
      setSetupSaving(false);
    }
  };

  const updateLessonInState = (eventId: string, paid: boolean) => {
    const updateEvents = (lessonEvents: any[]) =>
      lessonEvents.map((event) =>
        event.id === eventId ? { ...event, paid } : event
      );

    setPastEvents(updateEvents);
    setEvents(updateEvents);
    setNextEvents(updateEvents);
  };

  const handleTogglePaid = async (event: any) => {
    const nextPaid = !event.paid;

    updateLessonInState(event.id, nextPaid);

    try {
      await axios.patch(
        `${baseURL}/lessons/events/${encodeURIComponent(event.id)}/paid`,
        { paid: nextPaid },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      console.error("Error updating paid status:", error);
      updateLessonInState(event.id, Boolean(event.paid));
    }
  };

  return (
    <Box>
      <Helmet>
        <title>Lesson Schedule</title>
      </Helmet>
      <Dialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Connect Google Calendar</DialogTitle>
        <DialogContent>
          <Stack direction="column" gap={2} mt={1}>
            <Typography variant="body2" color="textSecondary">
              Share the exact Google Calendar you want to sync with Lesson
              Ledger, then paste that calendar ID here.
            </Typography>
            {serviceAccountEmail && (
              <Alert severity="info">{serviceAccountEmail}</Alert>
            )}
            <Typography variant="body2" color="textSecondary">
              Google Calendar Settings, Settings for my calendars, choose your
              calendar, then Share with specific people. Add the email above
              with See all event details permission.
            </Typography>
            <Alert severity="success">
              Lesson Ledger only syncs timed events whose description starts
              with a price, like $80 or $120.50.
            </Alert>
            <Typography variant="body2" color="textSecondary">
              Copy the Calendar ID from Integrate calendar. For each tutoring
              event, put the price on the first line of the description, then
              add any notes underneath.
            </Typography>
            <TextField
              autoFocus
              label="Calendar ID"
              value={calendarId}
              onChange={(event) => setCalendarId(event.target.value)}
              placeholder="yourname@gmail.com"
              fullWidth
              size="small"
            />
            {setupError && <Alert severity="error">{setupError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetupOpen(false)}>Skip</Button>
          <Button
            onClick={() =>
              window.open(
                "https://calendar.google.com/calendar/u/0/r/settings",
                "_blank"
              )
            }
          >
            Open Calendar Settings
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCalendarId}
            disabled={setupSaving}
          >
            {setupSaving ? "Saving..." : "Save and Sync"}
          </Button>
        </DialogActions>
      </Dialog>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" gap={2} width="100%">
          <Typography
            variant="h1"
            fontSize="2rem"
            fontWeight={700}
            color="#11142d"
          >
            {scheduleView === "current"
              ? "This Week's Lessons"
              : scheduleView === "past"
              ? "Previous Week"
              : "Upcoming Week"}
          </Typography>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="space-between"
            width="100%"
          >
            <Stack
              direction="row"
              alignItems="center"
              sx={{ flex: 1, justifyContent: "flex-start" }}
            >
              <CustomButton
                title="Edit Calendar"
                handleClick={() =>
                  window.open(
                    "https://calendar.google.com/calendar/u/0/r",
                    "_blank"
                  )
                }
                backgroundColor="#475be8"
                color="#fcfcfc"
                icon={<EditIcon />}
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              gap={1.25}
              sx={{
                bgcolor: "#f6f7fb",
                border: "1px solid #e6e8f0",
                borderRadius: "999px",
                color: "#5f6472",
                px: 1.5,
                py: 0.75,
              }}
            >
              <Stack direction="row" alignItems="center" gap={0.5}>
                <AccessTimeFilledIcon sx={{ fontSize: 15 }} />
                <Typography fontSize={12} fontWeight={600}>
                  Hours
                </Typography>
                <Typography fontSize={12}>
                  {formatHours(displayedSummary.hours)}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <PaidIcon sx={{ fontSize: 15 }} />
                <Typography fontSize={12} fontWeight={600}>
                  Income
                </Typography>
                <Typography fontSize={12}>
                  ${displayedSummary.income.toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              flexWrap="wrap"
              justifyContent="flex-end"
              sx={{ flex: 1 }}
            >
              <ToggleButtonGroup
                exclusive
                size="small"
                value={scheduleView}
                onChange={(_event, nextView) => {
                  if (nextView) {
                    setScheduleView(nextView);
                  }
                }}
                sx={{
                  bgcolor: "#fcfcfc",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              >
                <ToggleButton value="past">Previous</ToggleButton>
                <ToggleButton value="current">Current</ToggleButton>
                <ToggleButton value="next">Upcoming</ToggleButton>
              </ToggleButtonGroup>
              <Tooltip title="Calendar sync settings">
                <IconButton
                  aria-label="Calendar sync settings"
                  onClick={openCalendarSetup}
                  sx={{
                    border: "1px solid #e0e0e0",
                    color: "#475be8",
                    width: 40,
                    height: 40,
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
          {loading && (
            <Typography>Please wait a moment while fetching...</Typography>
          )}
        {!loading && (
          <Grid container spacing={2}>
            {lessonDays.map((day, index) => (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={4}
                xl={3}
                key={day}
                sx={{ borderRight: index !== 6 ? "1px solid #ccc" : "none" }}
              >
                <List sx={{ pt: 0 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      alignItems: "center",
                      color: currentDay === index ? "#475BE8" : "#11142d",
                      display: "flex",
                      gap: 1,
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    {day}
                    {currentDay === index && (
                      <Chip
                        label="Today"
                        size="small"
                        sx={{
                          bgcolor: "#eef1ff",
                          color: "#475BE8",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Typography>
                  {filterEventsByDay(day).length === 0 ? (
                    <ListItem>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                          py: 1,
                          ml: -2,
                        }}
                      >
                        No lessons
                      </Typography>
                    </ListItem>
                  ) : (
                    filterEventsByDay(day).map((event: any) => {
                      const lessonDetails = getLessonDetails(event.description);

                      return (
                        <ListItem
                          key={event.id}
                          sx={{
                            py: 1,
                            ml: -2,
                          }}
                        >
                          <Card
                            variant="outlined"
                            sx={{
                              borderColor:
                                currentDay === index ? "#c9d1ff" : "#ececec",
                              borderRadius: "8px",
                              width: "100%",
                            }}
                          >
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                              <Stack direction="row" justifyContent="space-between" gap={1}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={700}
                                  color="#11142d"
                                >
                                  {event.summary}
                                </Typography>
                                <Chip
                                  label={lessonDetails.price}
                                  size="small"
                                  sx={{
                                    bgcolor: "#eaf8ef",
                                    color: "#188038",
                                    fontWeight: 700,
                                  }}
                                />
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={1}
                                mt={1}
                              >
                                <Chip
                                  clickable
                                  label={event.paid ? "Paid" : "Unpaid"}
                                  onClick={() => handleTogglePaid(event)}
                                  size="small"
                                  sx={{
                                    bgcolor: event.paid
                                      ? "#eaf8ef"
                                      : "#fff4e5",
                                    color: event.paid ? "#188038" : "#9a5b00",
                                    fontWeight: 700,
                                  }}
                                />
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={1}
                                mt={1}
                              >
                                <AccessTimeFilledIcon fontSize="small" />
                                <Typography variant="body2" color="#11142d">
                                  {formatTime(event.start.dateTime)} -{" "}
                                  {formatTime(event.end.dateTime)}
                                </Typography>
                              </Stack>
                              {lessonDetails.notes && (
                                <Typography
                                  variant="body2"
                                  color="#6f6f7b"
                                  mt={1}
                                  sx={{ whiteSpace: "pre-line" }}
                                >
                                  {lessonDetails.notes}
                                </Typography>
                              )}
                              {event.hangoutLink && (
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  gap={1}
                                  mt={1}
                                >
                                  <VideocamIcon fontSize="small" />
                                  <Typography
                                    variant="body2"
                                    color="#1976D2"
                                    sx={{
                                      cursor: "pointer",
                                      fontWeight: 600,
                                    }}
                                    onClick={() =>
                                      window.open(event.hangoutLink, "_blank")
                                    }
                                  >
                                    Meeting
                                  </Typography>
                                </Stack>
                              )}
                            </CardContent>
                          </Card>
                        </ListItem>
                      );
                    })
                  )}
                </List>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default LessonSchedule;
