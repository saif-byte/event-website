import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";
import { apiCall } from "../../utils/api";
const AddEventModal = ({ open, onClose, refreshEvents }) => {
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

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });

    // Clear the error when the user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    const { name, startDate, endDate, location, description, maleSeats, femaleSeats, price } = eventData;

    if (!name) newErrors.name = "Event Name is required.";
    if (!startDate) newErrors.startDate = "Start Date is required.";
    if (!endDate) newErrors.endDate = "End Date is required.";
    if (!location) newErrors.location = "Location is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!maleSeats) newErrors.maleSeats = "Male Seats are required.";
    if (!femaleSeats) newErrors.femaleSeats = "Female Seats are required.";
    if (!price) newErrors.price = "Price is required.";

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End Date cannot be earlier than Start Date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    if (validateForm()) {
      setConfirmOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
      await apiCall("/events", "POST", eventData);
      refreshEvents(); // Refresh event list
      setConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <>
      {/* Add Event Form Modal */}
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Event Name" name="name" onChange={handleChange} error={!!errors.name} helperText={errors.name} />
          <TextField fullWidth margin="dense" type="date" label="Start Date" name="startDate" onChange={handleChange} InputLabelProps={{ shrink: true }} error={!!errors.startDate} helperText={errors.startDate} />
          <TextField fullWidth margin="dense" type="date" label="End Date" name="endDate" onChange={handleChange} InputLabelProps={{ shrink: true }} error={!!errors.endDate} helperText={errors.endDate} />
          <TextField fullWidth margin="dense" label="Location" name="location" onChange={handleChange} error={!!errors.location} helperText={errors.location} />
          <TextField fullWidth margin="dense" label="Description" name="description" onChange={handleChange} error={!!errors.description} helperText={errors.description} />
          <TextField fullWidth margin="dense" type="number" label="Male Seats" name="maleSeats" onChange={handleChange} error={!!errors.maleSeats} helperText={errors.maleSeats} />
          <TextField fullWidth margin="dense" type="number" label="Female Seats" name="femaleSeats" onChange={handleChange} error={!!errors.femaleSeats} helperText={errors.femaleSeats} />
          <TextField fullWidth margin="dense" type="number" label="Price" name="price" onChange={handleChange} error={!!errors.price} helperText={errors.price} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button onClick={handleAddClick} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Event Creation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to add this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">No</Button>
          <Button onClick={handleSubmit} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddEventModal;
