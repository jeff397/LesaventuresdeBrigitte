// src/components/ConfirmModal/ConfirmModal.jsx
import "./confirmModal.css";

function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
