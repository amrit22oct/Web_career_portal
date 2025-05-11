import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import JobContext from "../context/JobContext";
import { AuthContext } from "../context/AuthContext";
import { FaRegEye, FaEdit, FaTrashAlt, FaRegPaperPlane } from "react-icons/fa";  // Importing icons from react-icons
import API from "../services/api";

const JobCard = ({ job }) => {
  const { user } = useContext(AuthContext);
  const { refetchJobs } = useContext(JobContext);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setIsDeleting(true);
      try {
        await API.delete(`/jobs/${job._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Job deleted successfully");
        if (refetchJobs) refetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleApply = () => {
    alert("Applied to job!");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-6 flex flex-col justify-between border border-gray-200 hover:border-blue-500">
      <div>
        <h3 className="text-2xl font-semibold text-blue-800 mb-3 transition-colors duration-300 ease-in-out hover:text-blue-600">
          {job.title || "Untitled Role"}
        </h3>

        <p className="text-gray-700 mb-2">
          <span className="font-medium text-gray-800">Company:</span> {job.company || "Unknown"}
        </p>

        <p className="text-gray-600 mb-4">
          <span className="font-medium text-gray-800">Location:</span> {job.location || "Not specified"}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-between items-center">
        <Link
          to={`/jobs/${job._id}`}
          className="flex items-center bg-blue-600 text-white text-sm px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          <FaRegEye className="mr-2" /> View Details
        </Link>

        {user?.role === "recruiter" && user._id === job.recruiter && (
          <>
            <Link
              to={`/jobs/edit/${job._id}`}
              className="flex items-center bg-yellow-500 text-white text-sm px-6 py-3 rounded-xl hover:bg-yellow-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              <FaEdit className="mr-2" /> Edit
            </Link>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex items-center bg-red-500 text-white text-sm px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FaTrashAlt className="mr-2" /> {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}

        {user?.role === "student" && (
          <button
            onClick={handleApply}
            className="flex items-center bg-green-600 text-white text-sm px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            <FaRegPaperPlane className="mr-2" /> Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
