import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  ButtonGroup,
  Box,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { apiCall } from "../../utils/api";
import { useNavigate } from "react-router-dom";

import EventList from "../EventList";
import RegisteredUsers from "../RegisteredUsers";
import ContactUsers from "../ContactUsers";
import AdminLayout from "../../layouts/AdminLayout";

import AddEventModal from "../../components/AddEventModal/AddEventModal";
import Pagination from "../../components/Pagination/Pagination";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("events");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [filterType, setFilterType] = useState("UPCOMING");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalRecords, setTotalRecords] = useState(0);

  const navigate = useNavigate();
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleViewDetails = (event) => {
    navigate(`/events/${event._id}`, { state: { event } });
  };

  useEffect(() => {
    if (activeTab === "events") {
      fetchEvents();
    } else if (activeTab === "contacts") {
      fetchContacts();
    }
  }, [activeTab, currentPage, filterType]);

  const fetchEvents = async () => {
    try {
      const response = await apiCall(
        `/events?page=${currentPage}&pageSize=${pageSize}&eventStatus=${filterType}`,
        "GET"
      );
      setEvents(response.events);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await apiCall("/contact/all", "GET");
      setContacts(response.data);
    } catch (error) {
      setError("Failed to load contacts");
      console.error("Contact fetch error:", error);
    }
  };

  const handleDeleteEvent = (deletedEventId) => {
    setEvents(events.filter((event) => event._id !== deletedEventId));
  };

  const fetchRegisteredUsers = async (eventId) => {
    try {
      const data = await apiCall(`/events/${eventId}/registered-users`, "GET");
      setRegisteredUsers(data.registeredUsers);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error("Error fetching registered users:", error);
    }
  };

  const handleEditEvent = (eventId) => {
    const eventToEdit = events.find((event) => event._id === eventId);
    setEventToEdit(eventToEdit);
    setOpenAddModal(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onAddEventClick = () => {
    setEventToEdit(null);
    setOpenAddModal(true);
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Box
        sx={{
          padding: 3,
          minHeight: "100vh",
        }}
      >
        {activeTab === "events" && (
          <Paper elevation={2} sx={{ padding: 3, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight="bold">
                Events Dashboard
              </Typography>
              <Button variant="contained" onClick={onAddEventClick}>
                + Add Event
              </Button>
            </Stack>

            <Box mb={3}>
              <ButtonGroup>
                <Button
                  variant={filterType === "UPCOMING" ? "contained" : "outlined"}
                  onClick={() => setFilterType("UPCOMING")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={filterType === "PAST" ? "contained" : "outlined"}
                  onClick={() => setFilterType("PAST")}
                >
                  Past
                </Button>
              </ButtonGroup>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {selectedEvent ? (
              <RegisteredUsers
                registeredUsers={registeredUsers}
                eventId={selectedEvent}
                onBack={() => setSelectedEvent(null)}
              />
            ) : (
              <EventList
                events={events}
                loading={loading}
                error={error}
                onDeleteEvent={handleDeleteEvent}
                onViewDetails={handleViewDetails}
                onEditEvent={handleEditEvent}
                fetchRegisteredUsers={fetchRegisteredUsers}
              />
            )}

            <Box mt={3}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          </Paper>
        )}

        {activeTab === "contacts" && (
          <Paper elevation={2} sx={{ padding: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Contact Submissions
            </Typography>
            <ContactUsers contacts={contacts} />
          </Paper>
        )}

        {activeTab === "users" && (
          <Paper elevation={2} sx={{ padding: 3, borderRadius: 3 }}>
            <Typography variant="h6">
              User Management Coming Soon...
            </Typography>
          </Paper>
        )}
      </Box>

      <AddEventModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        refreshEvents={fetchEvents}
        eventToEdit={eventToEdit}
      />
    </AdminLayout>
  );
};

export default Dashboard;
