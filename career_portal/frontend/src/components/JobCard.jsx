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

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  const handleApply = () => {
    setShowApplyModal(true);
  };

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

          {user?.role === "student" && (
            <button onClick={handleApply} className="apply-btn">
              <FaRegPaperPlane className="icon" /> Apply
            </button>
          )}
        </div>
      </div>

      {showApplyModal && (
        <ApplyJobModal jobId={job._id} closeModal={() => setShowApplyModal(false)} />
      )}
    </>
  );
};

export default JobCard;
