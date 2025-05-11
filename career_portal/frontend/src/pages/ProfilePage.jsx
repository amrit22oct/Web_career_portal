import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePic, setProfilePic] = useState(user?.profilePic || ''); // Store the user's profile picture

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Display the image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, profilePic }), // Send the profilePic along with the form data
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      updateUser(updated); // Update AuthContext
      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="p-6 text-center text-gray-600">Loading profile…</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-3xl shadow-xl profile-container">
      <h2 className="text-3xl font-bold text-center text-white mb-8">My Profile</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      {/* Profile Picture */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <img
            src={profilePic || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-gradient-to-r from-teal-400 to-teal-600 shadow-lg transition-transform transform hover:scale-110 object-cover"
          />
          <label
            htmlFor="profilePic"
            className="absolute bottom-0 right-0 bg-teal-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-teal-700 transition duration-300"
          >
            <i className="fas fa-camera"></i>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Personal Information */}
      {!editing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <strong className="text-xl text-teal-600">Name:</strong>
            <p className="text-gray-700">{user.name}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <strong className="text-xl text-teal-600">Email:</strong>
            <p className="text-gray-700">{user.email}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <strong className="text-xl text-teal-600">Role:</strong>
            <p className="text-gray-700 capitalize">{user.role}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <strong className="text-xl text-teal-600">Joined:</strong>
            <p className="text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="col-span-2">
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Write a short bio..."
              />
            </div>
          </div>
          <div className="mb-6">
            <strong className="block text-teal-600">Change Profile Picture:</strong>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="flex justify-between gap-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm({ name: user.name, email: user.email, bio: user.bio });
                setProfilePic(user?.profilePic || '');
                setSuccess('');
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg shadow-lg hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Social Links Section */}
      <div className="mt-8">
        <h3 className="text-3xl font-semibold text-white mb-6">Social Links</h3>
        <div className="flex gap-6 justify-center">
          <a href={user?.socialLinks?.linkedin || '#'} target="_blank" className="text-blue-600 hover:text-blue-800 transition duration-300">
            <i className="fab fa-linkedin fa-3x"></i>
          </a>
          <a href={user?.socialLinks?.github || '#'} target="_blank" className="text-gray-800 hover:text-gray-900 transition duration-300">
            <i className="fab fa-github fa-3x"></i>
          </a>
          <a href={user?.socialLinks?.twitter || '#'} target="_blank" className="text-blue-400 hover:text-blue-600 transition duration-300">
            <i className="fab fa-twitter fa-3x"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
