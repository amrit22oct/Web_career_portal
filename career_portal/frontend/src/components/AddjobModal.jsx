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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white w-[95%] max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Post a New Job</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Fields */}
          {[
            { label: "Job Title", type: "text", value: title, setter: setTitle, placeholder: "Enter job title" },
            { label: "Company", type: "text", value: company, setter: setCompany, placeholder: "Enter company name" },
            { label: "Location", type: "text", value: location, setter: setLocation, placeholder: "Enter job location" },
            { label: "Salary (₹)", type: "number", value: salary, setter: setSalary, placeholder: "Enter salary" },
            { label: "Required Skills", type: "text", value: skills, setter: setSkills, placeholder: "E.g. JavaScript, React, Node.js" },
          ].map(({ label, type, value, setter, placeholder }, idx) => (
            <div key={idx}>
              <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                required
              />
            </div>
          ))}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job role"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
              required
            />
          </div>

          {/* Select Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              >
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Time Period</label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          {/* Apply By */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Apply By</label>
            <input
              type="date"
              value={applyBy}
              onChange={(e) => setApplyBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
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
