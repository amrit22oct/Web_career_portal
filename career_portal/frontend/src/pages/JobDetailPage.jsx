import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const JobDetailsPage = () => {
  const { jobId } = useParams(); // Access the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="p-6 text-lg">Loading job details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

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
          {job.skills && job.skills.map((skill, index) => (
            <li key={index} className="text-gray-600">{skill}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetailsPage;
