import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../../utils/api";
import RegisteredUsers from "../RegisteredUsers";
import { Button, Typography } from "@mui/material";
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
    <>
      <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>

     
<div style={{ padding: "20px" }}>
      <Button onClick={() => navigate(-1)} variant="outlined" style={{ marginBottom: 10 }}>
        ← Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>{event.name}</Typography>
      <Typography><strong>Date:</strong> {new Date(event.date).toLocaleString()}</Typography>
      <Typography><strong>Location:</strong> {event.location}</Typography>
      <Typography><strong>Description:</strong> {event.description}</Typography>

      <RegisteredUsers
        registeredUsers={registeredUsers}
        eventId={eventId}
        refreshEvent={null}
        onBack={() => navigate(-1)}
      />
    </div>
    </AdminLayout>
    </>

  );
};

export default AdminEventDetailPage;
