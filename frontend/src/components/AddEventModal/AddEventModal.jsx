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
    rsvpStartDate: "",
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

  const getMinDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const minDateTime = getMinDateTime();

  useEffect(() => {
    if (eventToEdit) {
      const formatDateTime = (date) => {
        const d = new Date(date);
        d.setSeconds(0, 0);
        return d.toISOString().slice(0, 16);
      };

      setEventData({
        name: eventToEdit.name,
        rsvpStartDate: formatDateTime(eventToEdit.rsvpStartDate),
        startDate: formatDateTime(eventToEdit.startDate),
        endDate: formatDateTime(eventToEdit.endDate),
        location: eventToEdit.location,
        description: eventToEdit.description,
        maleSeats: eventToEdit.maleSeats,
        femaleSeats: eventToEdit.femaleSeats,
        price: eventToEdit.price,
      });
    } else {
      setEventData({
        name: "",
        rsvpStartDate: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        maleSeats: "",
        femaleSeats: "",
        price: "",
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    const {
      name,
      rsvpStartDate,
      startDate,
      endDate,
      location,
      description,
      maleSeats,
      femaleSeats,
      price,
    } = eventData;

    const now = new Date();

    if (!name) newErrors.name = "Event Name is required.";

    // if (!rsvpStartDate || new Date(rsvpStartDate) < now) {
    //   newErrors.rsvpStartDate = "RSVP start must be in the future.";
    // }

    // if (!startDate || new Date(startDate) < now) {
    //   newErrors.startDate = "Start date/time must be in the future.";
    // }

    // if (!endDate || new Date(endDate) < now || new Date(endDate) < new Date(startDate)) {
    //   newErrors.endDate = "End date/time must be after start date/time and in the future.";
    // }

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
        await apiCall(`/events/${eventToEdit._id}`, "PUT", eventData);
      } else {
        await apiCall("/events", "POST", eventData);
      }
      refreshEvents();
      setConfirmOpen(false);
      onClose();
      setEventData({
        name: "",
        rsvpStartDate: "",
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
            label="RSVP Start Date"
            name="rsvpStartDate"
            type="datetime-local"
            value={eventData.rsvpStartDate}
            onChange={handleChange}
            error={!!errors.rsvpStartDate}
            helperText={errors.rsvpStartDate}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDateTime }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Start Date & Time"
            name="startDate"
            type="datetime-local"
            value={eventData.startDate}
            onChange={handleChange}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDateTime }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="End Date & Time"
            name="endDate"
            type="datetime-local"
            value={eventData.endDate}
            onChange={handleChange}
            error={!!errors.endDate}
            helperText={errors.endDate}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDateTime }}
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
