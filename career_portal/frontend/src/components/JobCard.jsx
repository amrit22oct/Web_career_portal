// src/components/JobCard.js
import React from "react";

const JobCard = ({ job, onViewApplicants, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onViewApplicants}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Applicants
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
