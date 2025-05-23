import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { name, email, password, role } = formData;
      await AuthService.register({ name, email, password, role });
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error registering. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-3xl p-10 max-w-md w-full animate-fadeIn border border-indigo-300"
      >
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 tracking-wide">
          Create Your Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-lg mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-indigo-700 font-semibold mb-2 text-lg">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            className="border border-indigo-300 rounded-xl p-4 w-full text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-indigo-700 font-semibold mb-2 text-lg">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="border border-indigo-300 rounded-xl p-4 w-full text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm"
            required
          />
        </div>

        <div className="mb-5 relative">
          <label className="block text-indigo-700 font-semibold mb-2 text-lg">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className="border border-indigo-300 rounded-xl p-4 w-full text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600 font-semibold hover:text-indigo-800 transition select-none focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="mb-5 relative">
          <label className="block text-indigo-700 font-semibold mb-2 text-lg">Confirm Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border border-indigo-300 rounded-xl p-4 w-full text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600 font-semibold hover:text-indigo-800 transition select-none focus:outline-none"
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="mb-8">
          <label className="block text-indigo-700 font-semibold mb-2 text-lg">Register As</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border border-indigo-300 rounded-xl p-4 w-full text-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm"
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-extrabold transition duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 ${
            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-indigo-700 mt-8 text-sm sm:text-base">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
