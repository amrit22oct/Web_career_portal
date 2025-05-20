import React, { useState } from 'react';
import API from '../services/api';

const ApplyJobModal = ({ jobId, closeModal }) => {
  const [resumeLink, setResumeLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus('Submitting your application...');
    try {
      await API.post(
        `/jobs/${jobId}/apply`,
        {
          resumeLink,
          coverLetter: coverLetter.trim() || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setStatus('✅ Application submitted successfully!');
      setTimeout(() => {
        closeModal();
      }, 2000); // auto-close after 2 seconds
    } catch (err) {
      setStatus(
        `❌ ${err.response?.data?.message || 'Failed to submit application.'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Apply for this Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resume Link Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition text-gray-900 placeholder-black text-base"
              placeholder="https://your-resume.com"
              value={resumeLink}
              onChange={e => setResumeLink(e.target.value)}
            />
          </div>

          {/* Cover Letter Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <textarea
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition resize-none text-gray-900 placeholder-black text-base"
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
          </div>

          {/* Status Message */}
          {status && (
            <div className="text-sm text-center text-blue-700 font-medium bg-blue-50 p-2 rounded border border-blue-300">
              {status}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white transition ${
                loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
