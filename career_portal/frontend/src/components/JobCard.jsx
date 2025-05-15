import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import JobContext from "../context/JobContext";
import { AuthContext } from "../context/AuthContext";
import { FaRegEye, FaRegPaperPlane } from "react-icons/fa";
import ApplyJobModal from "./ApplyJobModal";
import "../styles/JobCard.css";

const JobCard = ({ job }) => {
  const { user } = useContext(AuthContext);
  const { refetchJobs } = useContext(JobContext);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // If there's no user, just display the job without showing "Apply" functionality
  return (
    <>
      <div className="job-card">
        <div>
          <h3 className="job-title">{job.title || "Untitled Role"}</h3>

          <p className="job-info">
            <span className="label">Company:</span> {job.company || "Unknown"}
          </p>

          <p className="job-info">
            <span className="label">Location:</span> {job.location || "Not specified"}
          </p>
        </div>

        <div className="job-actions">
          <Link to={`/jobs/${job._id}`} className="view-btn">
            <FaRegEye className="icon" /> View Details
          </Link>

          {/* Show Apply button only for logged-in students */}
          {user?.role === "student" && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center bg-green-600 text-white text-sm px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              <FaRegPaperPlane className="mr-2" /> Apply
            </button>
          )}
        </div>
      </div>

      {/* Show Apply Job Modal only if user is logged in and Apply button is clicked */}
      {showApplyModal && (
        <ApplyJobModal jobId={job._id} closeModal={() => setShowApplyModal(false)} />
      )}
    </>
  );
};

export default JobCard;
