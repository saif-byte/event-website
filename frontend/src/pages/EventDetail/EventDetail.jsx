import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './EventDetail.css';
import mainImage from "../../assets/images/home.svg";
import infoIcon from "../../assets/icons/info.svg";

import Header from "../Header/Header";

const EventDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

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
            <p>{event.description}</p>
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
      </div>
    </>
  );
};

export default EventDetailPage;
