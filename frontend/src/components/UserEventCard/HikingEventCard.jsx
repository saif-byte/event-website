import "./HikingEventCard.css";
import dateRangeIcon from "../../assets/icons/date-range.svg";
import priceIcon from "../../assets/icons/price.svg";
import greenCircle from "../../assets/icons/green-circle.png";
import peopleIcon from "../../assets/icons/people.svg"

import { Typography, Button } from "@mui/material";


export default function HikingEventCard({ event, onRSVP, onUnrsvp }) {
  return (
    <div className="event-card-container">
      <div className="inner-event-card-container">
        <div className="event-card-user">
          <div className="event-content">
          {typeof event.remainingSeatsForUserGender === "number" ? (
  event.remainingSeatsForUserGender === 0 ? (
    <div className="soldout">Sold Out</div>
  ) : (
    <div className="remaining-seats">
      <img src={peopleIcon} alt="peopleicon" className="people-icon" />
      <span>{event.remainingSeatsForUserGender + " seats remaining"}</span>
    </div>
  )
) : null}          
<div className="event-content-box">
<h2 className="event-title">{event.name}</h2>
<p className="event-description">
  {event.description.length > 100 ? (
    <>
      {event.description.slice(0, 100)}...
      <span
        className="see-more-link"
        onClick={() => onRSVP(event)}
      >
        See More
      </span>
    </>
  ) : event.description}
</p>

            <div className="event-details">
              <div className="event-date">
              <img src={dateRangeIcon} className="calendar-icon"></img>
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
              </div>

              <div className="event-price">
                <img src={priceIcon} className="price-icon"></img>
                <span>{event.price ?  "$" +event.price : "Free Event"}</span>
              </div>
            </div>
            </div>
            <div className="button-box-card">
  {/* Conditionally render the RSVP or Unrsvp button */}
  {event.isAlreadyRegistered ? (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button
        className="unrsvp-button"
        onClick={() => onUnrsvp(event)}
      >
        Unrsvp
      </button>

      {event.paymentPending && (
        <span className="payment-pending-chip">Payment Pending</span>
      )}
    </div>
  ) : (
    <button className="rsvp-button" onClick={() => onRSVP(event)}>
      RSVP Me
    </button>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
