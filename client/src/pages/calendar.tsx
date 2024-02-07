import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'; // Import Box, Typography, List, and ListItem components from Material-UI

const Calendar: React.FC = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/v1/calendar/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Function to get the day of the week from a date string
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Function to check if a date falls within the current week (Monday to Sunday)
  const isCurrentWeek = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Get Monday of the current week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);

    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
      <Box>
        <List>
          {/* Render list items for each day of the week */}
          {events.filter((event: any) => isCurrentWeek(event.start.dateTime)).map((event: any) => (
            <ListItem key={event.id}>
              <ListItemText
                primary={event.summary}
                secondary={getDayOfWeek(event.start.dateTime)}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Calendar;
