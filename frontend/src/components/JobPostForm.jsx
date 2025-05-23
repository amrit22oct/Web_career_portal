import { useState } from "react";

const JobPostForm = ({ onSubmit }) => {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!jobData.title || !jobData.company || !jobData.description) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (jobData.salary && isNaN(jobData.salary)) {
      setErrorMessage("Salary must be a valid number.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(jobData);
      setSuccessMessage("Job posted successfully!");
      setJobData({
        title: "",
        company: "",
        description: "",
        location: "",
        salary: "",
      });
    } catch (error) {
      setErrorMessage("There was an error posting the job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-xl p-8 mx-auto my-10"
    >
      <h2 className="text-2xl font-semibold text-white text-center mb-6">
        Post a New Job
      </h2>

      {errorMessage && (
        <p className="text-red-400 text-sm font-semibold mb-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-400 text-sm font-semibold mb-4">
          {successMessage}
        </p>
      )}

      <input
        type="text"
        name="title"
        placeholder="Job Title"
        value={jobData.title}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white focus:bg-white/30 outline-none"
        required
      />
      <input
        type="text"
        name="company"
        placeholder="Company"
        value={jobData.company}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white focus:bg-white/30 outline-none"
        required
      />
      <textarea
        name="description"
        placeholder="Job Description"
        value={jobData.description}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white focus:bg-white/30 outline-none"
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={jobData.location}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white focus:bg-white/30 outline-none"
      />
      <input
        type="number"
        name="salary"
        placeholder="Salary"
        value={jobData.salary}
        onChange={handleChange}
        className="w-full mb-6 px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white focus:bg-white/30 outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
          loading
            ? "bg-gradient-to-r from-indigo-400 to-purple-400 opacity-50 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
        }`}
      >
        {loading ? "Posting..." : "Post Job"}
      </button>
    </form>
  );
};

export default JobPostForm;
