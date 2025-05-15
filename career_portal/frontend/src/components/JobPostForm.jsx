import { useState } from 'react';
import Button from './Button'; // Assuming you have a Button component
import '../styles/jobform.css'
const JobPostForm = ({ onSubmit }) => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!jobData.title || !jobData.company || !jobData.description) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    
    if (jobData.salary && isNaN(jobData.salary)) {
      setErrorMessage('Salary must be a valid number.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(jobData); // Handle the job submission in parent component
      setSuccessMessage('Job posted successfully!');
      setJobData({ title: '', company: '', description: '', location: '', salary: '' });
    } catch (error) {
      setErrorMessage('There was an error posting the job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-form">
      <h2 className="form-title">Post a New Job</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <input
        type="text"
        name="title"
        placeholder="Job Title"
        value={jobData.title}
        onChange={handleChange}
        className="form-input"
        required
      />
      <input
        type="text"
        name="company"
        placeholder="Company"
        value={jobData.company}
        onChange={handleChange}
        className="form-input"
        required
      />
      <textarea
        name="description"
        placeholder="Job Description"
        value={jobData.description}
        onChange={handleChange}
        className="form-input"
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={jobData.location}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="number"
        name="salary"
        placeholder="Salary"
        value={jobData.salary}
        onChange={handleChange}
        className="form-input"
      />

      <button
        type="submit"
        disabled={loading}
        className={`form-button ${loading ? 'disabled' : ''}`}
      >
        {loading ? 'Posting...' : 'Post Job'}
      </button>
    </form>
  );
};

export default JobPostForm;
