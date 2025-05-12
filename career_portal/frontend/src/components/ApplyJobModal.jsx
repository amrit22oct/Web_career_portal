import React, { useState } from "react";
import API from "../services/api";

const ApplyJobModal = ({ jobId, closeModal }) => {
  const [resumeLink, setResumeLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        `/jobs/${jobId}/apply`,
        { resumeLink, coverLetter },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Application submitted successfully!");
      closeModal();
    } catch (err) {
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Apply for this Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Resume Link</label>
            <input
              type="url"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="https://your-resume-link.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              rows="4"
              placeholder="Write your cover letter..."
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
