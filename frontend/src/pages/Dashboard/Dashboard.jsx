import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { apiCall } from "../../utils/api";
import EventList from "../EventList";
import RegisteredUsers from "../RegisteredUsers";
import Sidebar from "../../components/Sidebar/Sidebar";
import AddEventModal from "../../components/AddEventModal/AddEventModal";
import "./Dashboard.css";
import Header from "../Header/Header";
import Pagination from "../../components/Pagination/Pagination";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("events"); // Default tab
  const [openAddModal, setOpenAddModal] = useState(false); // Modal state
  const [eventToEdit, setEventToEdit] = useState(null); // Store event to edit
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalRecords, setTotalRecords] = useState(0); // Track total records for pagination

  useEffect(() => {
    fetchEvents();
  }, [currentPage]); // Fetch events whenever the page changes

  const handleDeleteEvent = (deletedEventId) => {
    setEvents(events.filter(event => event._id !== deletedEventId));
  };

  const fetchEvents = async () => {
    try {
      const response = await apiCall(
        `/events?page=${currentPage}&pageSize=${pageSize}`,
        "GET"
      );
      setEvents(response.events);
      setTotalRecords(response.totalRecords); // Assuming the response includes totalRecords
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

  // Logic to handle editing an event
  const handleEditEvent = (eventId) => {
    const eventToEdit = events.find(event => event._id === eventId);
    setEventToEdit(eventToEdit); // Set the event to edit
    setOpenAddModal(true); // Open the modal to edit
  };

  // Pagination logic
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const onAddEventClick = () => {
    setEventToEdit(null); // Reset eventToEdit for adding a new event
    setOpenAddModal(true); // Open the modal for adding a new event
  };
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <>
      <Header />
      <div className="dashboard-layout">
        <Sidebar onSelectTab={setActiveTab} activeTab={activeTab} />

        <div className="dashboard-content">
          <Typography variant="h4" className="dashboard-title">
            {activeTab === "dashboard" ? "Dashboard Overview" : "Event Dashboard"}
          </Typography>

          {activeTab === "events" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onAddEventClick()}
                style={{ marginBottom: "15px" }}
              >
                + Add Event
              </Button>

              {selectedEvent ? (
                <RegisteredUsers
                  registeredUsers={registeredUsers}
                  onBack={() => setSelectedEvent(null)}
                />
              ) : (
                <EventList
                  events={events}
                  loading={loading}
                  error={error}
                  onDeleteEvent={handleDeleteEvent}
                  onSelectEvent={fetchRegisteredUsers}
                  onEditEvent={handleEditEvent} // Pass handleEditEvent to EventList
                />
              )}

              {/* Pagination Controls */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {activeTab === "users" && <Typography variant="h6">User Management Coming Soon...</Typography>}
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        refreshEvents={fetchEvents}
        eventToEdit={eventToEdit} // Pass eventToEdit to modal for editing
      />
    </>
  );
};

export default Dashboard;
