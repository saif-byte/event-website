import "./HikingEventCard.css";
import dateRangeIcon from "../../assets/icons/date-range.svg";
import priceIcon from "../../assets/icons/price.svg";
import greenCircle from "../../assets/icons/green-circle.png";

import { Typography, Button } from "@mui/material";


export default function HikingEventCard({ event, onRSVP, onUnrsvp }) {
  return (
    <div className="event-card-container">
      <div className="inner-event-card-container">
        <div className="event-card-user">
          <div className="event-content">
            <h2 className="event-title">{event.name}</h2>
            <p className="event-description">{event.description}</p>

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
            <div className="button-box">
            {/* Conditionally render the RSVP or Unrsvp button */}
            {event.isAlreadyRegistered ? (
              <button className="unrsvp-button"                              
              onClick={() => onUnrsvp(event)}>
                Unrsvp
              </button>
            ) : (
              <>
              <button className="rsvp-button"  onClick={() => onRSVP(event)}>
                RSVP Me
              </button>
               <div className="seats-remaining-box">
               <img src={greenCircle} alt="" className="active-circle" />
               <div className="seats-remaining">
  {event.remainingSeatsForUserGender === 0
    ? "No seats remaining"
    : `${event.remainingSeatsForUserGender}/${event.totalSeatsForGender} seats remaining`}
</div>             </div> </>            
            )}
           

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
