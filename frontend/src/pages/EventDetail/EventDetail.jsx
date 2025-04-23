import React , { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './EventDetail.css';
import mainImage from "../../assets/images/home.svg";
import infoIcon from "../../assets/icons/info.svg";
import { apiCall } from "../../utils/api";
import RSVPModal from "../../components/RSVPModal/RSVPModal";
import ResponseModal from "../../components/ResponseModal/ResponseModal";
import Header from "../Header/Header";
import { toast } from "react-toastify";


const EventDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

const handleRSVPConfirm = async () => {
    try {
      const response = await apiCall(`/events/${event._id}/register`, "POST");
      setResponseMessage(response.message);
      setIsResponseModalOpen(true);
      navigate(`/home`);
       toast.success("Successfully Registered for the event", {
              position: "top-center", // You can change this based on your preference
              autoClose: 5000, // Time in ms before the toast disappears
              hideProgressBar: false, // Hide the progress bar
            });
           
    } catch (error) {
      setResponseMessage(error.message);
      setIsResponseModalOpen(true);
    } finally {
      setIsRSVPModalOpen(false);
    }
  };
  
  const handleCloseResponseModal = () => {
    setIsResponseModalOpen(false);
  };
  
  const handleCloseModal = () => {
    setIsRSVPModalOpen(false)
  }
  

  if (!event) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>
          Event not found. Please return to the{" "}
          <button onClick={() => navigate("/home")}>Home Page</button>.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="event-detail-container">
        <img className="main-image" src={mainImage} alt="Main" />

        <div className="event-details-box">
          <div className="detail-side">
            <h1 className="event-name">{event.name}</h1>
            <p className="event-location">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="event-date">
              <strong>Date:</strong> {new Date(event.date).toLocaleString()}
            </p>
            <p className="event-price">
              <strong>Price:</strong> {event?.price ? ( "$" + event.price) : "Free Event"}
            </p>
            <div className="description-box">
            <h3>Event Details</h3>
            <p>{event.description}</p>
            </div>
          </div>

          {event.price > 0 && (
            <div className="note-side">
              <img src={infoIcon} alt="Info" className="info-icon" />
              <div>
                <p>
                  This event is not free. Your RSVP will only be confirmed after the payment is completed.
                </p>
                <p>
                  <strong>How to Pay:</strong>
                  <br />
                  1. Click the <em>"Pay Now"</em> button after RSVPing.
                  <br />
                  2. Choose your preferred payment method (Credit Card, Debit Card, or Mobile Wallet).
                  <br />
                  3. Complete the transaction and wait for confirmation.
                </p>
                <p>
                  Once payment is verified, your registration will be confirmed via email or SMS.
                </p>
              </div>
            </div>
          )}

          {/* Add RSVP button here if needed */}
        </div>
        <div className="button-box">     
        <button  className="confirm-button-rsvp"   onClick={() => setIsRSVPModalOpen(true)}
        >
            RSVP Me
          </button>
        </div>
      </div>
      {isRSVPModalOpen && (
  <RSVPModal 
    event={event} 
    onConfirm={handleRSVPConfirm} 
    onClose={handleCloseModal} 
  />
  
)}
{isResponseModalOpen && (
  <ResponseModal
    message={responseMessage}
    onClose={handleCloseResponseModal}
  />
)}

    </>
  );
};

export default EventDetailPage;
