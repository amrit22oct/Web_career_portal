import React, { useState, useEffect } from 'react';
import API from '../services/api';

const EditJobModal = ({ job, closeModal, refreshJobDetails }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    skills: [],
    applyBy: '',
    timePeriod: 'Internship',
    jobType: 'Job',
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        description: job.description || '',
        skills: job.skills || [],
        applyBy: job.applyBy ? job.applyBy.slice(0, 10) : '',
        timePeriod: job.timePeriod || 'Internship',
        jobType: job.jobType || 'Job',
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!formData.skills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, company, location, salary, description, applyBy } = formData;
    if (!title || !company || !location || !salary || !description || !applyBy) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const updatedJob = await API.put(`/jobs/${job._id}`, formData);
      refreshJobDetails(updatedJob.data);
      closeModal();
    } catch (err) {
      alert('Failed to update job details.');
    }
  };

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative
          flex flex-col"
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-600 text-3xl font-semibold transition-colors"
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Job
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
          {[ 
            { name: 'title', label: 'Job Title' },
            { name: 'company', label: 'Company' },
            { name: 'salary', label: 'Salary', type: 'number' },
            { name: 'location', label: 'Location' },
            { name: 'description', label: 'Description', textarea: true },
          ].map(({ name, label, type = 'text', textarea }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block mb-2 font-medium text-gray-700"
              >
                {label}
              </label>
              {textarea ? (
                <textarea
                  id={name}
                  name={name}
                  rows={4}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              ) : (
                <input
                  id={name}
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                  min={type === 'number' ? 0 : undefined}
                />
              )}
            </div>
          ))}

          <div>
            <label
              htmlFor="applyBy"
              className="block mb-2 font-medium text-gray-700"
            >
              Apply By
            </label>
            <input
              id="applyBy"
              type="date"
              name="applyBy"
              value={formData.applyBy}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-900
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="timePeriod"
                className="block mb-2 font-medium text-gray-700"
              >
                Time Period
              </label>
              <select
                id="timePeriod"
                name="timePeriod"
                value={formData.timePeriod}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option>Internship</option>
                <option>Part-time</option>
                <option>Full-time</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="jobType"
                className="block mb-2 font-medium text-gray-700"
              >
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option>Job</option>
                <option>Internship</option>
                <option>Freelance</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="skillsInput"
              className="block mb-2 font-medium text-gray-700"
            >
              Skills
            </label>
            <input
              id="skillsInput"
              type="text"
              placeholder="Type skill and press Enter or ,"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-gray-900
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <div className="flex flex-wrap gap-3 mt-3">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-indigo-600 hover:text-red-600 transition"
                    aria-label={`Remove skill ${skill}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md
              font-semibold transition duration-200 shadow-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
