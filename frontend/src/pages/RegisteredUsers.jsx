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
  Box,
  Chip,
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
      const res = await apiCall("/events/mark-payment", "POST", {
        eventId,
        userId: selectedUserId,
      });
      toast.success(res.message);
      handleMenuClose();
      if (refreshEvent) refreshEvent();
      const user = registeredUsers.find((user) => user.userId._id === selectedUserId);
      if (user) user.paymentPending = false;
    } catch (err) {
      toast.error(err?.message || "Failed to mark payment.");
      handleMenuClose();
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Registered Users
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Instagram</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Registered Date</strong></TableCell>
              <TableCell><strong>Payment</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredUsers.length > 0 ? (
              registeredUsers.map((user) => (
                <TableRow key={user.userId._id} hover>
                  <TableCell>{user.userId.name}</TableCell>
                  <TableCell>{user.userId.email}</TableCell>
                  <TableCell>{user.userId.instagramHandle || "-"}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>
                    {new Date(user.userId.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.paymentPending ? "Pending" : "Done"}
                      color={user.paymentPending ? "warning" : "success"}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="actions"
                      onClick={(e) => handleMenuOpen(e, user.userId._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3, fontStyle: "italic", color: "gray" }}>
                  No users registered.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMarkAsPaid}>Mark Payment as Done</MenuItem>
      </Menu>
    </Box>
  );
};

export default RegisteredUsers;
