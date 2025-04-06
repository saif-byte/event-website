import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utils/api";
import "./Home.css";
import HikingEventCard from "../../components/UserEventCard/HikingEventCard";
import mainImage from "../../assets/images/home.svg";
import Header from "../Header/Header";
import RSVPModal from "../../components/RSVPModal/RSVPModal";
import ResponseModal from "../../components/ResponseModal/ResponseModal";
import ConfirmUnrsvpModal from "../../components/ConfirmUnrsvpModal/ConfirmUnrsvpModal";
import LoginRequiredModal from "../../components/LoginRequiredModal/LoginRequiredModal";
import Pagination from "../../components/Pagination/Pagination"
const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalRecords, setTotalRecords] = useState(0); // Track total records for pagination
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Single state to control which modal is active
  const [activeModal, setActiveModal] = useState(null); // 'rsvp', 'unrsvp', 'response', 'login', or null

  // Function to fetch events with pagination and search
  const fetchEvents = async () => {
    try {
      const response = await apiCall(
        `/events?page=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`,
        "GET"
      );
      
      setEvents(response.events); // List of events for the current page
      setTotalRecords(response.totalRecords); // Total records for pagination
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage, pageSize, searchTerm]); // Re-fetch when pagination or search term changes

  // Function to handle RSVP button click
  const handleRSVPClick = (event) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSelectedEvent(event);
      setActiveModal('login'); // Show login required modal if user is not logged in
    } else {
      setSelectedEvent(event);
      setActiveModal('rsvp'); // Open RSVP modal if user is logged in
    }
  };

  // Handle RSVP Confirmation API Call
  const handleRSVPConfirm = async () => {
    if (!selectedEvent) return;

    try {
      const response = await apiCall(`/events/${selectedEvent._id}/register`, "POST");
      setResponseMessage(response.message);
      // Update events list to reflect the RSVP
      fetchEvents();
    } catch (error) {
      setResponseMessage(error.message);
    } finally {
      setActiveModal('response'); // Show Response Modal
    }
  };

  // Function to handle Unrsvp button click
  const handleUnrsvpClick = (event) => {
    setSelectedEvent(event);
    setActiveModal('unrsvp'); // Open Unrsvp confirmation modal
  };

  // Handle Unrsvp Confirmation API Call
  const handleUnrsvpConfirm = async () => {
    if (!selectedEvent) return;

    try {
      const response = await apiCall(`/events/${selectedEvent._id}/unregister`, "DELETE");
      setResponseMessage(response.message);
      // Update events list to reflect the unRSVP
      fetchEvents();
    } catch (error) {
      setResponseMessage(error.message);
    } finally {
      setActiveModal('response'); // Show Response Modal
    }
  };

  // Handle search term change and reset to first page
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  // Pagination UI: Update page number
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate the total pages based on total records and page size
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <>
      <Header />
      <div className="home-container">
        <img className="main-image" src={mainImage} alt="Main" />

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearchChange} // Update search term
          />
        </div>

        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <HikingEventCard
                key={event._id}
                event={event}
                onRSVP={() => handleRSVPClick(event)}
                onUnrsvp={() => handleUnrsvpClick(event)}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
      
<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
      </div>

      {/* RSVP Confirmation Modal */}
      {activeModal === 'rsvp' && selectedEvent && (
        <RSVPModal 
          event={selectedEvent} 
          onConfirm={handleRSVPConfirm}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Unrsvp Confirmation Modal */}
      {activeModal === 'unrsvp' && selectedEvent && (
        <ConfirmUnrsvpModal
          event={selectedEvent}
          onConfirm={handleUnrsvpConfirm}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* API Response Modal */}
      {activeModal === 'response' && (
        <ResponseModal
          message={responseMessage}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Login Required Modal */}
      {activeModal === 'login' && (
        <LoginRequiredModal
          onLogin={() => navigate("/login")}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
};

export default Home;
