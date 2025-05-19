import React, { useState } from 'react';
import API from '../services/api';

const ApplyJobModal = ({ jobId, closeModal }) => {
  const [resumeLink, setResumeLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post(
        `/jobs/${jobId}/apply`,
        {
          resumeLink,
          coverLetter: coverLetter.trim() || undefined, // send undefined if empty
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Application submitted successfully!');
      closeModal();
    } catch (err) {
      alert(
        err.response?.data?.message || 'Failed to submit application.'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Apply for this Job</h2>
        <form onSubmit={handleSubmit}>
          {/* Resume URL */}
          <label className="block mb-4">
            <span className="text-sm font-medium">Resume Link *</span>
            <input
              type="url"
              required
              className="mt-1 w-full border rounded p-2"
              placeholder="https://your-resume.com"
              value={resumeLink}
              onChange={e => setResumeLink(e.target.value)}
            />
          </label>

          {/* Cover Letter (optional) */}
          <label className="block mb-4">
            <span className="text-sm font-medium">Cover Letter (optional)</span>
            <textarea
              rows="4"
              className="mt-1 w-full border rounded p-2"
              placeholder="Write your cover letter..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
          </label>

          {/* Buttons */}
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
