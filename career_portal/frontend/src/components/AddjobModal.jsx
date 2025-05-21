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
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      onJobPosted();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 text-white select-none">
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-white shadow-2xl p-10 w-[95%] max-w-3xl max-h-[95vh] overflow-y-auto overscroll-contain rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Post a New Job</h2>

        {error && (
          <p className="text-red-600 font-semibold text-center mb-6">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-white">
          {[  
            { label: "Job Title", type: "text", value: title, setter: setTitle, placeholder: "Enter job title" },
            { label: "Company", type: "text", value: company, setter: setCompany, placeholder: "Enter company name" },
            { label: "Location", type: "text", value: location, setter: setLocation, placeholder: "Enter job location" },
            { label: "Salary (₹)", type: "number", value: salary, setter: setSalary, placeholder: "Enter salary" },
            { label: "Required Skills", type: "text", value: skills, setter: setSkills, placeholder: "E.g. JavaScript, React, Node.js" },
          ].map(({ label, type, value, setter, placeholder }, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="mb-1 font-semibold text-sm">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                required
                className="bg-transparent border border-gray-400 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-white focus:outline-none transition"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-sm">Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job role"
              required
              className="bg-transparent border border-gray-400 rounded px-4 py-3 text-white placeholder-gray-400 resize-none h-24 focus:border-white focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-sm">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                required
                className="bg-black border border-gray-400 rounded px-4 py-2 text-white focus:border-white focus:outline-none transition"
              >
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-sm">Time Period</label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                required
                className="bg-black border border-gray-400 rounded px-4 py-2 text-white focus:border-white focus:outline-none transition"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-sm">Apply By</label>
            <input
              type="date"
              value={applyBy}
              onChange={(e) => setApplyBy(e.target.value)}
              required
              className="bg-transparent border border-gray-400 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-white focus:outline-none transition"
            />
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold hover:bg-red-500 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded font-semibold transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
