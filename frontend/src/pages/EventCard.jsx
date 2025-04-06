import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const EventCard = ({ event, onSelectEvent }) => {
  return (
    <Card className="event-card">
      <CardContent>
        <Typography variant="h6">{event.name}</Typography>
        <Typography className="event-description">{event.description}</Typography>
        <Typography>📍 {event.location}</Typography>
        <Typography>📅 {new Date(event.startDate).toLocaleDateString()}</Typography>
        <Button variant="contained" color="primary" onClick={() => onSelectEvent(event._id)}>
          View Registered Users
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
