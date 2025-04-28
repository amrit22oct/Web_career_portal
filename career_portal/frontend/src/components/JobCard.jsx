import { NavLink } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="job-card bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
      <NavLink to={`/jobs/${job.id}`}>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{job.title}</h3>
        <p className="text-gray-600 text-lg">{job.company}</p>
        <p className="text-gray-500 text-sm mb-4">{job.location}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{job.salary}</span>
          <span className="bg-blue-500 text-white py-1 px-3 rounded-full text-xs">
            {job.jobType}
          </span>
        </div>
        <p className="text-gray-700 text-base mt-4">{job.description}</p>
      </NavLink>
    </div>
  );
};

export default JobCard;
