import React from "react";
import "./ResponseModal.css";

export default function ResponseModal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="above-modal">
      <div className="modal">
        <h2>RSVP Status</h2>
        <p>{message}</p>

        <div className="modal-buttons">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
      </div>
    </div>
  );
}
