import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ClockIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import EditJobModal from "../components/EditJobModal";
import ApplyJobModal from "../components/ApplyJobModal";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
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

  const confirmDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/jobs/${job._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Job deleted successfully");
      navigate("/jobs");
    } catch (err) {
      alert("Failed to delete job. Please try again.");
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };

  const refreshJobDetails = (updatedJob) => {
    setJob(updatedJob);
  };

  if (loading) return <div className="p-6 text-lg">Loading job details...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  const isJobOwner =
    user?.role === "recruiter" &&
    (job.recruiter === user._id || job.recruiter?._id === user._id);

  const formattedDeadline = job?.deadline
    ? new Date(job.deadline).toLocaleDateString()
    : "N/A";

  return (
    <div className="job-details-container p-6 max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-md mt-8">
      <h1 className="text-4xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
        {job.title}
      </h1>
      <p className="text-lg text-gray-800 mb-2 flex items-center gap-2">
        <span className="font-semibold">Company:</span> {job.company}
      </p>
      <p className="text-gray-700 flex items-center gap-2 mb-1">
        <MapPinIcon className="h-5 w-5 text-gray-500" />
        {job.location}
      </p>
      <p className="text-gray-700 flex items-center gap-2 mb-1">
        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
        ${job.salary} per month
      </p>
      <p className="text-gray-700 flex items-center gap-2 mb-1">
        <ClockIcon className="h-5 w-5 text-yellow-600" />
        {job.experience || job.timePeriod}
      </p>
      <p className="text-gray-700 flex items-center gap-2 mb-1">
        <TagIcon className="h-5 w-5 text-purple-600" />
        {job.jobType}
      </p>
      <p className="text-gray-700 flex items-center gap-2 mb-4">
        <CalendarDaysIcon className="h-5 w-5 text-red-600" />
        Apply By: {formattedDeadline}
      </p>

      {/* Description */}
      <div className="bg-gray-100 rounded-lg p-5 mb-6 border-l-4 border-indigo-500 shadow-inner">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="h-6 w-6 text-indigo-500" />
          <h2 className="text-xl font-semibold text-gray-800">Job Description</h2>
        </div>
        <p className="text-gray-700 leading-relaxed max-h-64 overflow-y-auto pr-2">
          {job.description}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Required Skills:</h3>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(job.skills) ? (
            job.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {job.skills}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-4">
        {isJobOwner && (
          <>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition"
            >
              Edit
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
            >
              Delete
            </button>
          </>
        )}
        {user?.role === "student" && (
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            Apply Now
          </button>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <EditJobModal
          job={job}
          closeModal={() => setIsModalOpen(false)}
          refreshJobDetails={refreshJobDetails}
        />
      )}
      {isApplyModalOpen && (
        <ApplyJobModal
          jobId={job._id}
          closeModal={() => setIsApplyModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-black">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this job?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
