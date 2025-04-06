import "./RSVPModal.css";
import dateRangeIcon from "../../assets/icons/date-range-purple.svg";
import priceIcon from "../../assets/icons/price-purple.svg";
import locationIcon from "../../assets/icons/location.svg";

export default function RSVPModal({ event,onConfirm ,  onClose }) {
  return (
    <div className="modal-overlay">
      <div className="above-modal-content-rsvp">
      <div className="modal-content-rsvp">
        <h3>Thankyou for showing interest your are RSVP’D to the event</h3>
        <p>The Event Details are shown below and also been email to you</p>

        <div className="event-info">
          <p><strong>{event.name}</strong></p>
          <p className="event-description-rsvp">{event.description}</p>
          <div className="event-details-rsvp">
            <div className="event-date-rsvp">
              <img className="event-icon" src={dateRangeIcon} alt="" />
            {new Date(event.startDate).toLocaleDateString()}
            </div>
            <div className="event-location-rsvp">
              <img  className="event-icon" src={priceIcon} alt="" />
              {event.price ? "$" + event.price : "Free Event"}
            </div>
            <div className="event-location-rsvp">
              <img  className="event-icon" src={locationIcon} alt="" />
              {event.location}
            </div>
          </div>
        </div>

        <div className="modal-buttons-rsvp">
          <button className="confirm-button-rsvp" onClick={onConfirm}>Confirm</button>
          <button className="cancel-button-rsvp" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
    </div>
  );
}
