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
  TagIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
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
  const [deleting, setDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");
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
    setDeleteStatus("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteStatus("Deleting...");
    try {
      await API.delete(`/jobs/${job._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDeleteStatus("Job deleted successfully!");
      setTimeout(() => {
        setIsDeleteConfirmOpen(false);
        navigate("/jobs");
      }, 1500);
    } catch (err) {
      setDeleteStatus("Failed to delete job. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const refreshJobDetails = (updatedJob) => {
    setJob(updatedJob);
  };

  const isJobOwner =
    user?.role === "recruiter" &&
    (job?.recruiter === user._id || job?.recruiter?._id === user._id);

  const formattedDeadline = job?.deadline
    ? new Date(job.deadline).toLocaleDateString()
    : "N/A";

  if (loading)
    return <div className="p-6 text-center text-lg text-gray-600">Loading job details...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 flex items-center gap-3">
            <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
            {job.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Posted by: {job.company}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
          <Detail icon={MapPinIcon} text={job.location} />
          <Detail icon={CurrencyDollarIcon} text={`$${job.salary} / month`} />
          <Detail icon={ClockIcon} text={job.experience || job.timePeriod} />
          <Detail icon={TagIcon} text={job.jobType} />
          <Detail icon={CalendarDaysIcon} text={`Apply by: ${formattedDeadline}`} />
        </div>

        <div className="bg-gray-100 p-4 md:p-6 rounded-lg border-l-4 border-indigo-600 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">Job Description</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
            {job.description}
          </p>
        </div>

        {job.skills && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Required Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(job.skills) ? (
                job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {job.skills}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6">
          {isJobOwner && (
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md transition"
              >
                <PencilIcon className="w-5 h-5" />
                Edit
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
              >
                <TrashIcon className="w-5 h-5" />
                Delete
              </button>
            </>
          )}

          {user?.role === "student" && (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              Apply Now
            </button>
          )}
        </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            {deleteStatus ? (
              <p className={`mb-6 ${deleteStatus.includes("failed") ? "text-red-600" : "text-green-600"}`}>
                {deleteStatus}
              </p>
            ) : (
              <p className="mb-6">Are you sure you want to delete this job?</p>
            )}
            <div className="flex justify-end gap-4">
              {!deleting && (
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-4 py-2 ${deleting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} text-white rounded`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ icon: Icon, text }) => (
  <p className="flex items-center gap-2 text-gray-700">
    <Icon className="h-5 w-5 text-indigo-500" />
    {text}
  </p>
);

export default JobDetailsPage;
