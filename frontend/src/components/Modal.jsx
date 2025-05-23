// src/components/Modal.js
import React from "react";

const StudentListModal = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Applicants for {job.title}</h2>
        <p className="text-gray-600">No applicants to show (dummy data).</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StudentListModal;
