import React, { useState, useEffect } from 'react';
import API from '../services/api';

const EditJobModal = ({ job, closeModal, refreshJobDetails }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    skills: [],
    applyBy: '',
    timePeriod: 'Internship',
    jobType: 'Job',
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        description: job.description || '',
        skills: job.skills || [],
        applyBy: job.applyBy ? job.applyBy.slice(0, 10) : '',
        timePeriod: job.timePeriod || 'Internship',
        jobType: job.jobType || 'Job',
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!formData.skills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    if (confirmationStatus === "success") {
      closeModal();
    }
  };

  const handleUpdateJob = async () => {
    setLoading(true);
    setError('');
    setConfirmationStatus(null);

    try {
      const updatedJob = await API.put(`/jobs/${job._id}`, formData);
      refreshJobDetails(updatedJob.data);
      setConfirmationStatus("success");
    } catch (err) {
      setConfirmationStatus("error");
      setError(err.message || "Failed to update job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2 text-white select-none">
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-gray-300 shadow-2xl rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Edit Job</h2>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {[
            { label: "Job Title", name: "title", placeholder: "Enter job title" },
            { label: "Company", name: "company", placeholder: "Enter company name" },
            { label: "Location", name: "location", placeholder: "Enter job location" },
            { label: "Salary (₹)", name: "salary", type: "number", placeholder: "Enter salary" },
          ].map(({ label, name, type = "text", placeholder }, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="font-semibold text-sm mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                required
                className="bg-transparent border border-gray-500 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:border-white"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1">Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the job role"
              required
              className="bg-transparent border border-gray-500 rounded-md px-4 py-3 resize-none h-24 placeholder-gray-400 focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1">Required Skills</label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter or comma"
              className="bg-transparent border border-gray-500 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:border-white"
            />
            <div className="flex flex-wrap mt-2 gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-1">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                required
                className="bg-black border border-gray-500 rounded-md px-4 py-2"
              >
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-1">Time Period</label>
              <select
                name="timePeriod"
                value={formData.timePeriod}
                onChange={handleInputChange}
                required
                className="bg-black border border-gray-500 rounded-md px-4 py-2"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1">Apply By</label>
            <input
              type="date"
              name="applyBy"
              value={formData.applyBy}
              onChange={handleInputChange}
              required
              className="bg-transparent border border-gray-500 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded font-semibold transition ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-2">
          <div className="bg-white text-black rounded-xl p-6 w-full max-w-sm text-center shadow-2xl space-y-4">
            {!confirmationStatus ? (
              <>
                <h3 className="text-lg font-bold">Confirm Update</h3>
                <p className="text-sm">Are you sure you want to update this job?</p>
                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={closeConfirm}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateJob}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Confirm"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {confirmationStatus === "success" ? (
                  <p className="text-green-600 font-semibold">✅ Job updated successfully!</p>
                ) : (
                  <p className="text-red-600 font-semibold">❌ Failed to update job.<br />{error}</p>
                )}
                <button
                  onClick={closeConfirm}
                  className="bg-black text-white mt-4 px-4 py-2 rounded hover:bg-gray-800"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditJobModal;
