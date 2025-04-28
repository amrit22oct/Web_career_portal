import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Trap focus inside the modal (optional for better accessibility)
      const firstFocusableElement = document.querySelector('button');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg w-1/3 transform transition-all duration-300 ease-in-out scale-95 opacity-0"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="modal-title"
        style={{ animation: isOpen ? 'fadeIn 0.3s forwards' : 'fadeOut 0.3s forwards' }}
      >
        <h2 id="modal-title" className="text-xl font-semibold mb-4">Modal Title</h2>
        {children}
        <button
          className="mt-4 text-red-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
