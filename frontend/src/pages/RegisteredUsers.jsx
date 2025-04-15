import React, { useState } from "react";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";
import { apiCall } from "../utils/api";
const RegisteredUsers = ({ registeredUsers, eventId, onBack, refreshEvent }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleMarkAsPaid = async () => {
    try {
      await apiCall("/events/mark-payment", "POST", {
        eventId,
        userId: selectedUserId,
      });
      toast.success("Payment marked as done.");
      handleMenuClose();
      if (refreshEvent) refreshEvent();
    } catch (err) {
      toast.error("Failed to mark payment.");
      handleMenuClose();
    }
  };

  return (
    <div className="registered-users">
      <Button variant="outlined" onClick={onBack} style={{ marginBottom: "10px" }}>
        ← Back to Events
      </Button>
      <Typography variant="h5" gutterBottom>
        Registered Users
      </Typography>

      {registeredUsers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Instagram</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell><strong>Registered Date</strong></TableCell>
                <TableCell><strong>Payment Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registeredUsers.map((user) => (
                <TableRow key={user.userId._id}>
                  <TableCell>{user.userId.name}</TableCell>
                  <TableCell>{user.userId.email}</TableCell>
                  <TableCell>{user.userId.instagramHandle}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{new Date(user.userId.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{user.paymentPending ? "Pending" : "Done"}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="actions"
                      onClick={(e) => handleMenuOpen(e, user.userId._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No users registered.</Typography>
      )}

      {/* Menu for Actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMarkAsPaid}>Mark Payment as Done</MenuItem>
      </Menu>
    </div>
  );
};

export default RegisteredUsers;
