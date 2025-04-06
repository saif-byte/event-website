import React from "react";
import "./ConfirmUnrsvpModal.css";

const ConfirmUnrsvpModal = ({ event, onConfirm, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-unrsvp">
        <h3>Are you sure you want to unregister from this event?</h3>
        <p>{event.name}</p>
        <div className="modal-buttons-rsvp">
          <button onClick={onConfirm} className="confirm-button-rsvp">
            Yes, Unregister
          </button>
          <button onClick={onClose} className="cancel-button-rsvp">
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUnrsvpModal;
