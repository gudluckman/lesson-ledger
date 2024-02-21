import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Helmet } from "react-helmet";
import EditIcon from "@mui/icons-material/Edit";
import { CustomButton } from "components";
import { Stack } from "@pankod/refine-mui";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PaidIcon from "@mui/icons-material/Paid";
import VideocamIcon from "@mui/icons-material/Videocam";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const LessonSchedule: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDay] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  );

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5005/api/v1/lessons/events"
      );
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // To get weekly's lesson details then display in dashboard via localStorage
  useEffect(() => {
    let totalSum = 0;
    let totalHours = 0;
    let eventCount = 0;

    events.forEach((event: any) => {
      const regex = /\$(\d+)/g;
      const matches = event.description.match(regex);
      if (matches) {
        matches.forEach((match: any) => {
          totalSum += parseInt(match.substring(1));
        });
      }

      // Calculate duration in hours for each event
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);
      const durationInMs = end.getTime() - start.getTime();
      const durationInHours = durationInMs / (1000 * 60 * 60);
      totalHours += durationInHours;

      // Calculate each event
      eventCount++;
    });
    // averageHourlyRate = totalSum / totalHours;

    localStorage.setItem("currentWeeklyIncomeSum", totalSum.toString());
    localStorage.setItem("currentWeeklyHours", totalHours.toString());
    localStorage.setItem(
      "currentAverageHourlyRate",
      (totalSum / totalHours).toString()
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
    return events.filter(
      (event: any) => getDayOfWeek(event.start.dateTime) === day
    );
  };

  return (
    <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      <Helmet>
        <title>Lesson Schedule</title>
      </Helmet>
      <Stack direction="column" gap={3}>
        <Typography fontSize={25} fontWeight={700} color="#11142d">
          This Week's Lessons
        </Typography>
        <CustomButton
          title="Edit Calendar"
          handleClick={() =>
            window.open("https://calendar.google.com/calendar/u/0/r", "_blank")
          }
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={<EditIcon />}
        />
        {loading && (
          <Typography>Please wait a moment while fetching...</Typography>
        )}
      </Stack>
      {!loading && (
        <Grid container spacing={2}>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={2}
              key={day}
              sx={{ borderRight: index !== 6 ? "1px solid #ccc" : "none" }}
            >
              <List>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{
                    color: currentDay === index ? "#475BE8" : "inherit",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {day}
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
                      No Lesson Scheduled
                    </Typography>
                  </ListItem>
                ) : (
                  filterEventsByDay(day).map((event: any) => (
                    <ListItem
                      key={event.id}
                      sx={{
                        py: 1,
                        ml: -2,
                      }}
                    >
                      <Card
                        variant="outlined"
                        style={{
                          width: "100%",
                          backgroundColor:
                            currentDay === index ? "#475BE8" : "#fff",
                          color: currentDay === index ? "#fff" : "inherit",
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {event.summary}
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "8px",
                            }}
                          >
                            <AccessTimeFilledIcon
                              style={{ marginRight: "8px" }}
                            />
                            <Typography
                              variant="body2"
                              style={{
                                color:
                                  currentDay === index ? "white" : "inherit",
                              }}
                            >
                              {formatTime(event.start.dateTime)} to{" "}
                              {formatTime(event.end.dateTime)}
                            </Typography>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "8px",
                            }}
                          >
                            <PaidIcon style={{ marginRight: "8px" }} />
                            <Typography
                              variant="body2"
                              style={{
                                color:
                                  currentDay === index ? "white" : "inherit",
                              }}
                            >
                              {event.description}
                            </Typography>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "8px",
                            }}
                          >
                            <VideocamIcon style={{ marginRight: "8px" }} />
                            <Typography
                              variant="body2"
                              style={{
                                color:
                                  currentDay === index ? "#FFFFFF" : "#1976D2",
                                textDecoration: "none",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                window.open(event.hangoutLink, "_blank")
                              }
                            >
                              Meeting
                            </Typography>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "8px",
                            }}
                          >
                            <ModeEditIcon style={{ marginRight: "8px" }} />
                            <Typography
                              variant="body2"
                              style={{
                                color:
                                  currentDay === index ? "#FFFFFF" : "#1976D2",
                                textDecoration: "none",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                window.open(
                                  event.attachments[0].fileUrl,
                                  "_blank"
                                )
                              }
                            >
                              Jamboard
                            </Typography>
                          </div>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))
                )}
              </List>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LessonSchedule;
