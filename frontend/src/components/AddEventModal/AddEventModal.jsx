import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { apiCall } from "../../utils/api";

const AddEventModal = ({ open, onClose, refreshEvents, eventToEdit }) => {
  const [eventData, setEventData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    maleSeats: "",
    femaleSeats: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      // Ensure the dates are in the correct format (YYYY-MM-DD)
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Extracts the date part (YYYY-MM-DD)
      };
  
      setEventData({
        name: eventToEdit.name,
        startDate: formatDate(eventToEdit.startDate),
        endDate: formatDate(eventToEdit.endDate),
        location: eventToEdit.location,
        description: eventToEdit.description,
        maleSeats: eventToEdit.maleSeats,
        femaleSeats: eventToEdit.femaleSeats,
        price: eventToEdit.price,
      });
    } else {
      // Reset the form data when adding a new event
      setEventData({
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        maleSeats: "",
        femaleSeats: "",
        price: "",
      });
    }
  }, [eventToEdit]); // Only trigger when eventToEdit changes
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    const {
      name,
      startDate,
      endDate,
      location,
      description,
      maleSeats,
      femaleSeats,
      price,
    } = eventData;

    if (!name) {
      newErrors.name = "Event Name is required.";
    }
    if (!startDate || !endDate || new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End Date cannot be earlier than Start Date.";
    }
    if (!location) newErrors.location = "Location is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!maleSeats || parseInt(maleSeats) < 0)
      newErrors.maleSeats = "Male Seats are required.";
    if (!femaleSeats || parseInt(femaleSeats) < 0)
      newErrors.femaleSeats = "Female Seats are required.";
    if (!price || parseFloat(price) < 0) newErrors.price = "Price is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateClick = () => {
    if (validateForm()) {
      setConfirmOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
      if (eventToEdit) {
        // Update event
        await apiCall(`/events/${eventToEdit._id}`, "PUT", eventData);
      } else {
        // Add new event
        await apiCall("/events", "POST", eventData);
      }
      refreshEvents();
      setConfirmOpen(false);
      onClose();
      setEventData({
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        maleSeats: "",
        femaleSeats: "",
        price: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>{eventToEdit ? "Edit Event" : "Add New Event"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Event Name"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Start Date"
            name="startDate"
            type="date"
            value={eventData.startDate}
            onChange={handleChange}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="End Date"
            name="endDate"
            type="date"
            value={eventData.endDate}
            onChange={handleChange}
            error={!!errors.endDate}
            helperText={errors.endDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Male Seats"
            name="maleSeats"
            type="number"
            value={eventData.maleSeats}
            onChange={handleChange}
            error={!!errors.maleSeats}
            helperText={errors.maleSeats}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Female Seats"
            name="femaleSeats"
            type="number"
            value={eventData.femaleSeats}
            onChange={handleChange}
            error={!!errors.femaleSeats}
            helperText={errors.femaleSeats}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Price"
            name="price"
            type="number"
            value={eventData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateClick} color="primary">
            {eventToEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          Confirm Event {eventToEdit ? "Update" : "Creation"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {eventToEdit ? "update" : "add"} this event?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddEventModal;
