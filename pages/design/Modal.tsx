
import "./Modal.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않게
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
