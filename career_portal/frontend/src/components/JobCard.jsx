import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const formatSalary = (salary) =>
    salary ? `$${parseInt(salary).toLocaleString()}` : "Not specified";

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between h-full hover:scale-105 transition-transform duration-200">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{job.title || "Untitled Role"}</h3>

        <p className="text-gray-600">
          <span className="font-medium">Company:</span> {job.company || "Unknown"}
        </p>

        <p className="text-gray-500">
          <span className="font-medium">Location:</span> {job.location || "Not specified"}
        </p>

        <p className="text-gray-500">
          <span className="font-medium">Salary:</span> {formatSalary(job.salary)}
        </p>

        <p className="text-gray-500 mt-2">
          {job.description || "No description provided."}
        </p>

        {Array.isArray(job.skills) && job.skills.length > 0 ? (
          <div className="mt-4">
            <p className="font-semibold text-gray-800">Required Skills:</p>
            <ul className="flex flex-wrap gap-2 mt-2">
              {job.skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No skills listed</p>
        )}
      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="mt-4 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
