import "./LoginRequiredModal.css";

export default function LoginRequiredModal({ onLogin, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>You need to log in to register for this event</h2>
        <p>Please log in to proceed with your RSVP.</p>

        <div className="modal-buttons">
          <button className="login-button" onClick={onLogin}>Login</button>
          <button className="cancel-button" onClick={onClose}>Not Now</button>
        </div>
      </div>
    </div>
  );
}
