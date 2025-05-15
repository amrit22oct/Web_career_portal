import React, { useState } from "react";
import JobService from "../services/jobService";
import '../styles/addjobmodel.css'

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Post a New Job</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="job-form">
          {[
            { label: "Job Title", type: "text", value: title, setter: setTitle, placeholder: "Enter job title" },
            { label: "Company", type: "text", value: company, setter: setCompany, placeholder: "Enter company name" },
            { label: "Location", type: "text", value: location, setter: setLocation, placeholder: "Enter job location" },
            { label: "Salary (₹)", type: "number", value: salary, setter: setSalary, placeholder: "Enter salary" },
            { label: "Required Skills", type: "text", value: skills, setter: setSkills, placeholder: "E.g. JavaScript, React, Node.js" },
          ].map(({ label, type, value, setter, placeholder }, idx) => (
            <div key={idx} className="form-group">
              <label>{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job role"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Job Type</label>
              <select value={jobType} placeholder="choose" onChange={(e) => setJobType(e.target.value)} required>
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Period</label>
              <select value={timePeriod} placeholder="choose" onChange={(e) => setTimePeriod(e.target.value)} required className="form-group">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Apply By</label>
            <input
              type="date"
              value={applyBy}
              onChange={(e) => setApplyBy(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn cancel">Cancel</button>
            <button type="submit" disabled={loading} className="btn submit">
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
