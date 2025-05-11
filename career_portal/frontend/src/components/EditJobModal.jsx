import React, { useState, useEffect } from 'react';
import API from '../services/api';

const EditJobModal = ({ job, closeModal, refreshJobDetails }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    skills: []
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        description: job.description,
        skills: job.skills || []
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const input = e.target.value;
    const skillsArray = input
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill !== '');
    setFormData((prevData) => ({
      ...prevData,
      skills: skillsArray
    }));
  };

  const handleSave = async () => {
    const { title, company, location, salary, description } = formData;
    if (!title || !company || !location || !salary || !description) {
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
      className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className="bg-gradient-to-t from-blue-500 to-blue-400 p-6 rounded-lg w-96 shadow-lg animate__animated animate__fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">Edit Job</h2>

        {/* Job Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-white text-sm font-semibold mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter job title"
            className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ease-in-out duration-300"
          />
        </div>

        {/* Company */}
        <div className="mb-6">
          <label htmlFor="company" className="block text-white text-sm font-semibold mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Enter company name"
            className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ease-in-out duration-300"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label htmlFor="location" className="block text-white text-sm font-semibold mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location"
            className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ease-in-out duration-300"
          />
        </div>

        {/* Salary */}
        <div className="mb-6">
          <label htmlFor="salary" className="block text-white text-sm font-semibold mb-2">
            Salary
          </label>
          <input
            type="number"
            name="salary"
            id="salary"
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="Enter salary"
            className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ease-in-out duration-300"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-white text-sm font-semibold mb-2">
            Job Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter job description"
            className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ease-in-out duration-300"
          />
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label htmlFor="skills" className="block text-white text-sm font-semibold mb-2">
            Skills (comma separated)
          </label>
          <input
            type="text"
            name="skills"
            id="skills"
            value={formData.skills.join(', ')}
            onChange={handleSkillsChange}
            placeholder="Enter skills"
            className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ease-in-out duration-300"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-lg transition-all ease-in-out duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-lg transition-all ease-in-out duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
