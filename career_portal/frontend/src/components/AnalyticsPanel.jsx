// src/components/AnalyticsPanel.js
import React from "react";

const AnalyticsPanel = ({ jobs }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
      <p className="text-gray-600">Total Jobs Posted: {jobs.length}</p>
      <p className="text-gray-600">Applicants Received: 24</p>
      <p className="text-gray-600">Interviews Scheduled: 8</p>
    </div>
  );
};

export default AnalyticsPanel;
