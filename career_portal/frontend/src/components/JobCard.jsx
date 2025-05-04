import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    return salary ? `$${parseInt(salary).toLocaleString()}` : "Salary not specified";
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between h-full hover:scale-105 transition-transform duration-200">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
        <p className="text-gray-600">Company: {job.company}</p>
        <p className="text-gray-500">Location: {job.location}</p>
        <p className="text-gray-500">Salary: {formatSalary(job.salary)}</p>
        <p className="text-gray-500">{job.description || "No description provided."}</p>

        <div className="mt-2">
          <p className="font-semibold text-gray-800">Skills:</p>
          {job.skills && job.skills.length > 0 ? (
            <ul className="list-disc pl-5">
              {job.skills.map((skill, index) => (
                <li key={index} className="text-gray-600">{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No skills listed</p>
          )}
        </div>
      </div>

      <Link
        to={`/jobs/${job._id}`} // Navigating to the JobDetailsPage with the job's ID
        className="mt-4 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
