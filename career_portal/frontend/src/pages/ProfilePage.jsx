import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const generateDefaultAvatar = () => {
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  };


  const [profilePic, setProfilePic] = useState(
    user?.profilePic || generateDefaultAvatar(user?.name)
  );


  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
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
        body: JSON.stringify({ ...form, profilePic }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      updateUser(updated);
      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  if (!user) return <p className="profile-loading">Loading profile…</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      {error && <p className="profile-error">{error}</p>}
      {success && <p className="profile-success">{success}</p>}

      <div className="profile-picture-wrapper">
        <div className="profile-picture-box">
          <img
            src={profilePic}
            alt="Profile"
            className="profile-picture"
          />
          <label htmlFor="profilePic" className="profile-picture-label">
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

      {!editing ? (
        <div className="profile-info-grid">
          <div className="profile-info-box">
            <strong>Name:</strong>
            <p>{user.name}</p>
          </div>
          <div className="profile-info-box">
            <strong>Email:</strong>
            <p>{user.email}</p>
          </div>
          <div className="profile-info-box">
            <strong>Role:</strong>
            <p className="capitalize">{user.role}</p>
          </div>
          <div className="profile-info-box">
            <strong>Joined:</strong>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="profile-form-grid">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Write a short bio..." />
          </div>
          <div className="profile-upload">
            <strong>Change Profile Picture:</strong>
            <input type="file" accept="image/*" onChange={handleProfilePicChange} />
          </div>
          <div className="profile-button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm({ name: user.name, email: user.email, bio: user.bio });
                setProfilePic(user?.profilePic || generateDefaultAvatar(user?.name));
                setSuccess('');
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="profile-social">
        <h3>Social Links</h3>
        <div className="profile-social-links">
          <a href={user?.socialLinks?.linkedin || '#'} target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href={user?.socialLinks?.github || '#'} target="_blank" rel="noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href={user?.socialLinks?.twitter || '#'} target="_blank" rel="noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
