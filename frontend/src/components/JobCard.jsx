import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaRegEye, FaRegPaperPlane } from "react-icons/fa";
import ApplyJobModal from "./ApplyJobModal";

const JobCard = ({ job }) => {
  const { user } = useContext(AuthContext);
  const [showApplyModal, setShowApplyModal] = useState(false);

  return (
    <>
      <div
        className="
          relative
          bg-gradient-to-tr from-indigo-900/40 via-purple-900/25 to-indigo-800/30
          backdrop-blur-lg
          border border-indigo-700/40
          rounded-2xl
          p-6
          flex flex-col
          shadow-lg
          transition-transform duration-300 ease-in-out
          hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]
          group
          overflow-hidden
          w-full sm:max-w-md md:max-w-lg lg:max-w-xl
          mx-auto
          mb-8
        "
      >
        {/* Glow Border on Hover */}
        <div
          className="
            pointer-events-none
            absolute inset-0 rounded-2xl
            bg-gradient-to-r from-purple-400 via-pink-500 to-red-400
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            blur-[24px]
            -z-10
          "
        ></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Job Title */}
          <h3 className="text-white text-2xl font-bold mb-2 truncate">
            {job.title || "Untitled Role"}
          </h3>

          {/* Company & Location */}
          <div className="text-purple-200 text-sm sm:text-base space-y-1 mb-6">
            <p className="truncate">
              <span className="font-semibold text-white">Company:</span>{" "}
              {job.company || "Unknown"}
            </p>
            <p className="truncate">
              <span className="font-semibold text-white">Location:</span>{" "}
              {job.location || "Not specified"}
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Action Buttons */}
          <div className="border-t border-indigo-700/50 pt-4 mt-4 flex flex-col lg:flex-row justify-between items-center gap-4">
            <Link
              to={`/jobs/${job._id}`}
              className="
                flex items-center justify-center
                bg-indigo-600 hover:bg-indigo-700
                text-white
                px-5 py-2.5
                rounded-xl
                font-semibold
                shadow-md
                transition-all duration-200
                w-full lg:w-auto
                gap-2
              "
            >
              <FaRegEye size={16} />
              <span>View Details</span>
            </Link>

            {user?.role === "student" && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="
                  flex items-center justify-center
                  bg-pink-600 hover:bg-pink-700
                  text-white
                  px-5 py-2.5
                  rounded-xl
                  font-semibold
                  shadow-md
                  transition-all duration-200
                  w-full lg:w-auto
                  gap-2
                "
              >
                <FaRegPaperPlane size={16} />
                <span>Apply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyJobModal
          jobId={job._id}
          closeModal={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
};

export default JobCard;
