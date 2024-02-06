import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import axios from 'axios';

const Calendar = () => {
  // State to store the fetched events
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the backend route
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/v1/calendar/events');
        setEvents(response.data); // Update the events state with the fetched data
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents(); // Call the fetchEvents function when the component mounts
  }, []); // Empty dependency array ensures that this effect runs only once

  return (
    <Box>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {events.map((day, index) => (
          <Stack key={index} spacing={2}>
            <Typography variant="h6">{(day as { day: string, tasks: unknown[] }).day}</Typography>
            {(day as { day: string, tasks: unknown[] }).tasks.map((task: unknown, taskIndex: React.Key | null | undefined) => (
              <TextField
                key={taskIndex}
                value={task}
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            ))}
          </Stack>
        ))}
      </Box>
    </Box>
  );
};

export default Calendar;
