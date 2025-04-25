import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../../utils/api";
import RegisteredUsers from "../RegisteredUsers";
import { Button, Typography, Box, Divider, Paper } from "@mui/material";
import AdminLayout from "../../layouts/AdminLayout";

const AdminEventDetailPage = () => {
  const { state } = useLocation();
  const { event } = state || {};
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("events");

  useEffect(() => {
    if (!event) {
      navigate("/dashboard"); // fallback if user refreshes and no state is available
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await apiCall(`/events/${eventId}/registered-users`, "GET");
        setRegisteredUsers(res.registeredUsers);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
  }, [event, eventId, navigate]);

  if (!event) return null;

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Box sx={{ padding: 4 }}>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ marginBottom: 3 }}
        >
          ← Back to Dashboard
        </Button>

        <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            {event.name}
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Start Date:</strong> {new Date(event.startDate).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>End Date:</strong> {new Date(event.endDate).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>RSVP Date:</strong> {new Date(event.rsvpStartDate).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Location:</strong> {event.location}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Description:</strong> {event.description}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ marginTop: 4 }}>
          <RegisteredUsers
            registeredUsers={registeredUsers}
            eventId={eventId}
            refreshEvent={null}
            onBack={() => navigate(-1)}
          />
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AdminEventDetailPage;
