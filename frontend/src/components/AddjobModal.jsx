import React, { useState } from "react";
import JobService from "../services/jobService";

const AddJobModal = ({ onClose, onJobPosted }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [jobType, setJobType] = useState("Job");
  const [timePeriod, setTimePeriod] = useState("Full-time");
  const [applyBy, setApplyBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState(null);
  const [error, setError] = useState("");

  const handlePostJob = async () => {
    setLoading(true);
    setError("");
    setConfirmationStatus(null);

    try {
      const jobData = {
        title,
        description,
        location,
        company,
        salary,
        skills: skills.split(",").map((skill) => skill.trim()),
        jobType,
        timePeriod,
        applyBy,
      };

      await JobService.createJob(jobData);
      setConfirmationStatus("success");
      onJobPosted();
    } catch (err) {
      setConfirmationStatus("error");
      setError(err.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    if (confirmationStatus === "success") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 text-white select-none px-2">
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-gray-300 shadow-2xl rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Post a New Job</h2>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {[
            { label: "Job Title", type: "text", value: title, setter: setTitle, placeholder: "Enter job title" },
            { label: "Company", type: "text", value: company, setter: setCompany, placeholder: "Enter company name" },
            { label: "Location", type: "text", value: location, setter: setLocation, placeholder: "Enter job location" },
            { label: "Salary (₹)", type: "number", value: salary, setter: setSalary, placeholder: "Enter salary" },
            { label: "Required Skills", type: "text", value: skills, setter: setSkills, placeholder: "E.g. JavaScript, React" },
          ].map(({ label, type, value, setter, placeholder }, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="font-semibold text-sm mb-1">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                required
                className="bg-transparent border border-gray-500 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:border-white"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="font-semibold text-sm mb-1">Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job role"
              required
              className="bg-transparent border border-gray-500 rounded-md px-4 py-3 resize-none h-24 placeholder-gray-400 focus:outline-none focus:border-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
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
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
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
              value={applyBy}
              onChange={(e) => setApplyBy(e.target.value)}
              required
              className="bg-transparent border border-gray-500 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded font-semibold transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Posting..." : "Post Job"}
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
                <h3 className="text-lg font-bold">Confirm Job Posting</h3>
                <p className="text-sm">Are you sure you want to post this job?</p>
                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={closeConfirm}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostJob}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    disabled={loading}
                  >
                    {loading ? "Posting..." : "Confirm"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {confirmationStatus === "success" ? (
                  <p className="text-green-600 font-semibold">✅ Job posted successfully!</p>
                ) : (
                  <p className="text-red-600 font-semibold">❌ Failed to post job.<br />{error}</p>
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

export default AddJobModal;
