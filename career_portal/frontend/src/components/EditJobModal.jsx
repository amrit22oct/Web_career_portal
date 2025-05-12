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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-xl w-full rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Job</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'title', label: 'Job Title' },
            { name: 'company', label: 'Company' },
            { name: 'salary', label: 'Salary', type: 'number' },
            { name: 'location', label: 'Location' },
            { name: 'description', label: 'Description', textarea: true },
          ].map(({ name, label, type = 'text', textarea }) => (
            <div key={name}>
              <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
              {textarea ? (
                <textarea
                  name={name}
                  rows={3}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-slate-800 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-slate-800 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              )}
            </div>
          ))}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Apply By</label>
            <input
              type="date"
              name="applyBy"
              value={formData.applyBy}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-slate-800 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Time Period</label>
              <select
                name="timePeriod"
                value={formData.timePeriod}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-slate-800 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option>Internship</option>
                <option>Part-time</option>
                <option>Full-time</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-slate-800 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option>Job</option>
                <option>Internship</option>
                <option>Freelance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Skills</label>
            <input
              type="text"
              placeholder="Type skill and press Enter or ,"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="w-full px-4 py-2 text-slate-800 placeholder-slate-400 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex flex-wrap mt-2 gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-indigo-500 hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
