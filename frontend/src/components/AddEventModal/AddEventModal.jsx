import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  MenuItem,
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
    seatType: "GENDER_BASED", // default to GENDER_BASED for backward compatibility
    totalSeats: "",
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
        seatType: eventToEdit.seatType || "GENDER_BASED",
        totalSeats: eventToEdit.totalSeats || "",
        maleSeats: eventToEdit.maleSeats || "",
        femaleSeats: eventToEdit.femaleSeats || "",
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
        seatType: "GENDER_BASED",
        totalSeats: "",
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
      seatType,
      totalSeats,
      maleSeats,
      femaleSeats,
      price,
    } = eventData;

    const now = new Date();

    if (!name) newErrors.name = "Event Name is required.";

    // Event start date must be in the future AND after RSVP start
    if (!startDate || new Date(startDate) < now) {
      newErrors.startDate = "Event start must be in the future.";
    } else if (new Date(startDate) < new Date(rsvpStartDate)) {
      newErrors.startDate = "Event start must be after RSVP start.";
    }

    // Event end date must be in the future AND after start date
    if (!endDate || new Date(endDate) < now) {
      newErrors.endDate = "Event end must be in the future.";
    } else if (new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "Event end must be after the event start.";
    }
    if (!rsvpStartDate)
      newErrors.rsvpStartDate = "RSVP Start Date is required.";
    if (!startDate) newErrors.startDate = "Start Date is required.";
    if (!endDate) newErrors.endDate = "End Date is required.";

    if (!location) newErrors.location = "Location is required.";
    if (!description) newErrors.description = "Description is required.";

    if (!seatType) newErrors.seatType = "Seat type is required.";

    if (seatType === "TOTAL") {
      if (!totalSeats || parseInt(totalSeats) < 1) {
        newErrors.totalSeats = "Total Seats are required and must be at least 1.";
      }
    } else if (seatType === "GENDER_BASED") {
      if (!maleSeats || parseInt(maleSeats) < 0)
        newErrors.maleSeats = "Male Seats are required.";
      if (!femaleSeats || parseInt(femaleSeats) < 0)
        newErrors.femaleSeats = "Female Seats are required.";
    }

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
      let payload = { ...eventData };

      // Remove unused seat fields based on seatType
      if (payload.seatType === "TOTAL") {
        payload.maleSeats = undefined;
        payload.femaleSeats = undefined;
      } else if (payload.seatType === "GENDER_BASED") {
        payload.totalSeats = undefined;
      }

      if (eventToEdit) {
        await apiCall(`/events/${eventToEdit._id}`, "PUT", payload);
      } else {
        await apiCall("/events", "POST", payload);
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
        seatType: "GENDER_BASED",
        totalSeats: "",
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
        <DialogTitle>
          {eventToEdit ? "Edit Event" : "Add New Event"}
        </DialogTitle>
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

          {/* New seat type selector */}
          <TextField
            select
            fullWidth
            margin="dense"
            label="Seat Type"
            name="seatType"
            value={eventData.seatType}
            onChange={handleChange}
            error={!!errors.seatType}
            helperText={errors.seatType}
          >
            <MenuItem value="GENDER_BASED">Separate seats for gender</MenuItem>
            <MenuItem value="TOTAL">Total seats (no gender distinction)</MenuItem>
          </TextField>

          {/* Conditionally render seat fields */}
          {eventData.seatType === "TOTAL" ? (
            <TextField
              fullWidth
              margin="dense"
              label="Total Seats"
              name="totalSeats"
              type="number"
              value={eventData.totalSeats}
              onChange={handleChange}
              error={!!errors.totalSeats}
              helperText={errors.totalSeats}
            />
          ) : (
            <>
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
            </>
          )}

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
            Are you sure you want to {eventToEdit ? "update" : "add"} this
            event?
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
