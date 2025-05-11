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

  const [skillInput, setSkillInput] = useState('');

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

  const handleSkillKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!formData.skills.includes(newSkill)) {
        setFormData((prevData) => ({
          ...prevData,
          skills: [...prevData.skills, newSkill]
        }));
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prevData) => {
      const updatedSkills = [...prevData.skills];
      updatedSkills.splice(index, 1);
      return { ...prevData, skills: updatedSkills };
    });
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

        {['title', 'company', 'location', 'salary', 'description'].map((field) => (
          <div key={field} className="mb-6">
            <label htmlFor={field} className="block text-white text-sm font-semibold mb-2 capitalize">
              {field === 'salary' ? 'Salary (in ₹)' : field === 'description' ? 'Job Description' : field}
            </label>
            {field === 'description' ? (
              <textarea
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleInputChange}
                placeholder={`Enter ${field}`}
                className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            ) : (
              <input
                type={field === 'salary' ? 'number' : 'text'}
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleInputChange}
                placeholder={`Enter ${field}`}
                className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            )}
          </div>
        ))}

        {/* Skills with tag style UI */}
        <div className="mb-6">
          <label htmlFor="skills" className="block text-white text-sm font-semibold mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-white text-blue-700 px-3 py-1 rounded-full flex items-center space-x-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(idx)}
                  className="text-red-600 font-bold focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            id="skills"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill and press Enter"
            className="w-full p-3 border border-transparent rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
