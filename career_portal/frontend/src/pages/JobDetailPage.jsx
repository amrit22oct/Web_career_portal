import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await API.get(`/jobs/${jobId}`);
        setJob(data);
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/jobs/${job._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Job deleted successfully");
        navigate("/jobs");
      } catch (err) {
        alert("Failed to delete job. Please try again.");
      }
    }
  };

  const handleApply = async () => {
    try {
      await API.post(`/jobs/${job._id}/apply`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Applied successfully!");
    } catch (err) {
      alert("Failed to apply. Please try again.");
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading job details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  const isJobOwner =
    user?.role === "recruiter" &&
    (job.recruiter === user._id || job.recruiter?._id === user._id);

  return (
    <div className="job-details-container p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{job.title}</h1>
      <p className="text-xl font-semibold text-gray-700">Company: {job.company}</p>
      <p className="text-lg text-gray-600">Location: {job.location}</p>
      <p className="text-lg text-gray-600">Salary: ${job.salary}</p>
      <p className="text-lg text-gray-600">{job.description}</p>

      <div className="mt-4">
        <p className="font-semibold text-gray-800">Required Skills:</p>
        <ul className="list-disc pl-5">
          {Array.isArray(job.skills) ? (
            job.skills.map((skill, index) => (
              <li key={index} className="text-gray-600">{skill}</li>
            ))
          ) : (
            <li className="text-gray-600">{job.skills}</li>
          )}
        </ul>
      </div>

      <div className="mt-6">
        {isJobOwner && (
          <div className="flex gap-4">
            <Link
              to={`/jobs/edit/${job._id}`}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        )}

        {user?.role === "student" && (
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;
