import React, { useState } from 'react';
import API from '../services/api';

const ApplyJobModal = ({ jobId, closeModal }) => {
  const [resumeLink, setResumeLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      setShowConfirmation(true);
    } catch (err) {
      setStatus(
        `❌ ${err.response?.data?.message || 'Failed to submit application.'}`
      );
      setShowConfirmation(true);
    } finally {
      setLoading(false);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    if (status.startsWith('✅')) {
      closeModal(); // only close the modal if successful
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 sm:p-8 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Apply for this Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition text-gray-900 placeholder-gray-400 text-base"
              placeholder="https://your-resume.com"
              value={resumeLink}
              onChange={e => setResumeLink(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <textarea
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition resize-none text-gray-900 placeholder-gray-400 text-base"
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 flex-wrap">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white transition ${
                loading
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Application Status</h3>
            <p className={`text-base mb-4 ${status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
            <button
              onClick={closeConfirmation}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyJobModal;
