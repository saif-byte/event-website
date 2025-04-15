import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { apiCall } from "../../utils/api";
import EventList from "../EventList";
import RegisteredUsers from "../RegisteredUsers";
import ContactUsers from "../ContactUsers";

import Sidebar from "../../components/Sidebar/Sidebar";
import AddEventModal from "../../components/AddEventModal/AddEventModal";
import "./Dashboard.css";
import Header from "../Header/Header";
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    if (activeTab === "events") {
      fetchEvents();
    } else if (activeTab === "contacts") {
      fetchContacts();
    }
  }, [activeTab, currentPage]);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await apiCall(
        `/events?page=${currentPage}&pageSize=${pageSize}`,
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

  // Fetch contacts
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
    setEvents(events.filter(event => event._id !== deletedEventId));
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
    const eventToEdit = events.find(event => event._id === eventId);
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

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <>
      <Header />
      <div className="dashboard-layout">
        <Sidebar 
          onSelectTab={setActiveTab} 
          activeTab={activeTab} 
          tabs={["events", "contacts", "users"]}
        />

        <div className="dashboard-content">
         

          {activeTab === "events" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={onAddEventClick}
                style={{ marginBottom: "15px" }}
              >
                + Add Event
              </Button>

              {selectedEvent ? (
                <RegisteredUsers
                  registeredUsers={registeredUsers}
                  eventId ={selectedEvent}
                  onBack={() => setSelectedEvent(null)}
                />
              ) : (
                <EventList
                  events={events}
                  loading={loading}
                  error={error}
                  onDeleteEvent={handleDeleteEvent}
                  onSelectEvent={fetchRegisteredUsers}
                  onEditEvent={handleEditEvent}
                />
              )}

              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {activeTab === "contacts" && (
            <ContactUsers
            contacts={contacts}
             
            />
          )}

          {activeTab === "users" && (
            <Typography variant="h6">User Management Coming Soon...</Typography>
          )}
        </div>
      </div>

      <AddEventModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        refreshEvents={fetchEvents}
        eventToEdit={eventToEdit}
      />
    </>
  );
};

export default Dashboard;
