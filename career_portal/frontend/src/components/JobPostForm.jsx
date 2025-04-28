import { useState } from 'react';
import Button from './Button'; // Assuming you have a Button component

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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Post a New Job</h2>
      
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      <input
        type="text"
        name="title"
        placeholder="Job Title"
        value={jobData.title}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        name="company"
        placeholder="Company"
        value={jobData.company}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Job Description"
        value={jobData.description}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={jobData.location}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="number"
        name="salary"
        placeholder="Salary"
        value={jobData.salary}
        onChange={handleChange}
        className="w-full p-2 mb-6 border rounded"
      />
      
      <Button text={loading ? 'Posting...' : 'Post Job'} className={loading ? 'opacity-50 cursor-not-allowed' : ''} />
    </form>
  );
};

export default JobPostForm;
