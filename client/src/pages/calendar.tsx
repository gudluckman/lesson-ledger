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

const Calendar: React.FC = () => {
  const [events, setEvents] = useState([]);
  // Calculate the current day index correctly
  const [currentDay, setCurrentDay] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  );

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5005/api/v1/calendar/events"
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
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
            lg={2}
            xl={1.71}
            key={day}
            sx={{ borderRight: index !== 6 ? "1px solid #ccc" : "none" }}
          >
            <List>
              <Typography
                variant="h6"
                gutterBottom
                style={{
                  color: currentDay === index ? "#475BE8" : "inherit",
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
                        <Typography variant="subtitle1" component="h2">
                          {event.summary}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{
                            color: currentDay === index ? "#545454" : "inherit",
                            backgroundColor:
                              currentDay === index ? "#fff" : "transparent",
                            borderRadius: currentDay === index ? "5px" : "0px",
                            padding: currentDay === index ? "4px 8px" : "0px",
                            marginTop: "8px",
                          }}
                        >
                          {formatTime(event.start.dateTime)} to{" "}
                          {formatTime(event.end.dateTime)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))
              )}
            </List>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Calendar;
