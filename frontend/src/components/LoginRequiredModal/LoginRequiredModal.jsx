import "./LoginRequiredModal.css";

export default function LoginRequiredModal({ onLogin, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="above-modal-content">
      <div className="modal-content">
        <h2>You need to log in to register for this event</h2>
        <p>Please log in to proceed with your RSVP.</p>

        <div className="modal-buttons-rsvp">
          <button onClick={onLogin} className="confirm-button-rsvp">
            Login
          </button>
          <button onClick={onClose} className="cancel-button-rsvp">
            Not Now
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
