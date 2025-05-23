const ProfileCard = ({ user, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow w-80 mx-auto">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow w-80 mx-auto">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="flex items-center mb-4">
        <img
          src={user.profilePicture || '/default-avatar.png'}
          alt="Profile"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
      <button className="bg-blue-500 text-white py-2 px-4 rounded">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
