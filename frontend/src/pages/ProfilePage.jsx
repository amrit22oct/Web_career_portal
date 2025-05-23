import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Import the default avatar image from your assets folder
import logo from "../assets/logo.png";

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generateDefaultAvatar = () => {
    return logo; // Use the imported image from assets
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
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, profilePic }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      updateUser(updated);
      setEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <p className="py-6 text-center text-gray-400">Loading profile…</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-lg rounded-xl text-white font-sans">
      <h2 className="text-4xl font-bold text-center mb-8">My Profile</h2>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      {success && <p className="text-green-400 text-center mb-4">{success}</p>}

      <div className="flex justify-center mb-8 relative">
        <div className="relative">
          <img
            src={profilePic}
            alt="Profile"
            className="w-64 h-64 rounded-full border border-gray-600 shadow-xl object-cover bg-gray-800 transition-transform duration-300 hover:scale-105"
          />
          <label
            htmlFor="profilePic"
            className="absolute bottom-2 right-2 bg-teal-700 text-white p-3 rounded-full cursor-pointer shadow-md hover:bg-teal-600 transition-colors"
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

      {!editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-inner rounded">
            <strong className="block mb-2 text-gray-300">Name:</strong>
            <p>{user.name}</p>
          </div>
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-inner rounded">
            <strong className="block mb-2 text-gray-300">Email:</strong>
            <p>{user.email}</p>
          </div>
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-inner rounded capitalize">
            <strong className="block mb-2 text-gray-300">Role:</strong>
            <p>{user.role}</p>
          </div>
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-inner rounded">
            <strong className="block mb-2 text-gray-300">Joined:</strong>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="p-4 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="p-4 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Write a short bio..."
              rows={4}
              className="p-4 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 col-span-full"
            />
          </div>

          <div className="mb-6">
            <strong className="block mb-2 text-gray-300">Change Profile Picture:</strong>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="text-white"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded transition-colors"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm({ name: user.name, email: user.email, bio: user.bio });
                setProfilePic(
                  user?.profilePic || generateDefaultAvatar(user?.name)
                );
                setSuccess("");
              }}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-12 text-center">
        <h3 className="text-2xl text-gray-300 mb-4">Social Links</h3>
        <div className="flex justify-center gap-10 text-gray-400 text-3xl">
          <a
            href={user?.socialLinks?.linkedin || "#"}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-400 transition-transform duration-300 hover:scale-110"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href={user?.socialLinks?.github || "#"}
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-100 transition-transform duration-300 hover:scale-110"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href={user?.socialLinks?.twitter || "#"}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-500 transition-transform duration-300 hover:scale-110"
          >
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
