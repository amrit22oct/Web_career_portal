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
          border border-transparent
          rounded-2xl
          p-6
          flex flex-col justify-between
          shadow-xl shadow-black/30
          transition-transform duration-400 ease-in-out
          hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.04]
          group
          overflow-hidden
          w-[400px]
          h-[250px]
          mx-auto
          mb-8
        "
      >
        {/* Animated gradient border */}
        <div
          className="
            pointer-events-none
            absolute inset-0 rounded-2xl
            bg-gradient-to-r from-purple-400 via-pink-500 to-red-400
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-500
            blur-[24px]
            -z-10
          "
        ></div>

        <div className="relative z-10 flex flex-col h-full">
          <h3 className="text-white text-3xl font-extrabold mb-4 tracking-wide truncate">
            {job.title || "Untitled Role"}
          </h3>

          <div className="text-purple-200 flex-grow">
            <p className="mb-3 truncate">
              <span className="font-semibold text-white">Company:</span>{" "}
              {job.company || "Unknown"}
            </p>

            <p className="mb-3 truncate">
              <span className="font-semibold text-white">Location:</span>{" "}
              {job.location || "Not specified"}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap justify-between gap-4">
            <Link
              to={`/jobs/${job._id}`}
              className="
                flex items-center
                bg-indigo-600 hover:bg-indigo-700
                text-white
                px-5 py-3
                rounded-xl
                font-semibold
                shadow-lg shadow-indigo-700/50
                hover:shadow-xl
                transition
                whitespace-nowrap
                gap-2
              "
            >
              <FaRegEye size={18} /> View Details
            </Link>

            {user?.role === "student" && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="
                  flex items-center
                  bg-pink-600 hover:bg-pink-700
                  text-white
                  px-6 py-3
                  rounded-xl
                  font-semibold
                  shadow-lg shadow-pink-700/50
                  hover:shadow-xl
                  transition
                  whitespace-nowrap
                  gap-2
                "
              >
                <FaRegPaperPlane size={18} /> Apply
              </button>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyJobModal jobId={job._id} closeModal={() => setShowApplyModal(false)} />
      )}
    </>
  );
};

export default JobCard;
