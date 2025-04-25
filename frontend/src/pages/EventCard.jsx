import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const EventCard = ({ event, onViewDetails }) => {
  const description = event.description || "";
  const isLongDescription = description.length > 100;

  return (
    <Card className="event-card">
      <CardContent className="event-content-box">
        <Typography variant="h6">{event.name}</Typography>

        <Typography className="event-description">
          {isLongDescription ? (
            <>
              {description.slice(0, 100)}...
              <span
                className="see-more-link-admin"
                onClick={() => onViewDetails(event)}
              >
                {" "}
                See More
              </span>
            </>
          ) : (
            description
          )}
        </Typography>

        <Typography>📍 {event.location}</Typography>
        <Typography>📅 {new Date(event.startDate).toLocaleDateString()}</Typography>

        <Button
          variant="outlined"
          size="small"
          style={{ marginTop: 10, marginLeft: 10 }}
          onClick={() => onViewDetails(event)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
