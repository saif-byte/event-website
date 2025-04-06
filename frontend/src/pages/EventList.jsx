import React, { useState } from "react";
import { Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from "react-toastify";
import EventCard from "./EventCard";
import { apiCall } from "../utils/api";
const EventList = ({ events, loading, error, onSelectEvent }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isAdmin = JSON.parse(localStorage.getItem("user"))?.role === "ADMIN";

  const handleMenuOpen = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiCall(`/events/${selectedEventId}`, "DELETE");
      toast.success("Event deleted successfully!");
      // Optionally refresh the event list or remove the deleted event from the UI
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="events-list">
      {loading ? (
        <Typography>Loading events...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : events.length > 0 ? (
        events.map((event) => (
          <div key={event._id} style={{ position: "relative" }}>
            <EventCard event={event} onSelectEvent={onSelectEvent} />
            {isAdmin && (
              <>
                <IconButton
                  aria-label="settings"
                  onClick={(e) => handleMenuOpen(e, event._id)}
                  style={{ position: "absolute", top: 10, right: 10 }}
                >
                  <MoreVertIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedEventId === event._id}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleDeleteClick}>Delete Event</MenuItem>
                </Menu>
              </>
            )}
          </div>
        ))
      ) : (
        <Typography>No events available. Add a new event!</Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventList;
