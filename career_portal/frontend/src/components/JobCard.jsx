import React, { useContext } from "react";
import { Link } from "react-router-dom";
import JobContext from "../context/JobContext";

const JobCard = ({ job }) => {
  const { user } = useContext(JobContext); // Get user role

  const formatSalary = (salary) =>
    salary ? `$${parseInt(salary).toLocaleString()}` : "Not specified";

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/jobs/${job._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Job deleted successfully");
        // Optionally refetch or update context
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job");
      }
    }
  };

  const handleApply = () => {
    // Placeholder: Integrate apply logic
    alert("Applied to job!");
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between h-full hover:scale-105 transition-transform duration-200">
      <div>
        <h3 className="text-lg font-bold text-gray-800">
          {job.title || "Untitled Role"}
        </h3>

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

      <div className="mt-4 flex gap-3">
        <Link
          to={`/jobs/${job._id}`}
          className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </Link>

        {user?.role === "recruiter" && user._id === job.recruiter && (
          <>
            <Link
              to={`/jobs/edit/${job._id}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}

        {user?.role === "student" && (
          <button
            onClick={handleApply}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
