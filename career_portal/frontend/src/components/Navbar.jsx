import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = useMemo(() => (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-4 py-2 text-lg font-medium text-white hover:text-indigo-200 transition duration-300 ${
            isActive ? 'font-bold underline' : ''
          }`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          `px-4 py-2 text-lg font-medium text-white hover:text-indigo-200 transition duration-300 ${
            isActive ? 'font-bold underline' : ''
          }`
        }
      >
        Jobs
      </NavLink>
      <NavLink
        to="/internships"
        className={({ isActive }) =>
          `px-4 py-2 text-lg font-medium text-white hover:text-indigo-200 transition duration-300 ${
            isActive ? 'font-bold underline' : ''
          }`
        }
      >
        Internships
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `px-4 py-2 text-lg font-medium text-white hover:text-indigo-200 transition duration-300 ${
            isActive ? 'font-bold underline' : ''
          }`
        }
      >
        About
      </NavLink>
      {user && (
        <NavLink
          to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard'}
          className={({ isActive }) =>
            `px-4 py-2 text-lg font-medium text-white hover:text-indigo-200 transition duration-300 ${
              isActive ? 'font-bold underline' : ''
            }`
          }
        >
          Dashboard
        </NavLink>
      )}
    </>
  ), [user]);

  if (loading) {
    return (
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md px-8 py-4 flex justify-between items-center">
      {/* Logo on Left */}
      <NavLink
        to="/"
        className="text-2xl font-bold text-white hover:text-indigo-300 transition duration-300"
      >
        Web_Career_Portal
      </NavLink>

      {/* Navigation Links + Profile/Logout on Right */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          {navLinks}
        </div>

        {!user ? (
          <div className="flex items-center gap-4 ml-6">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 text-lg font-medium text-white hover:text-indigo-200 transition duration-300 ${
                  isActive ? 'font-bold underline' : ''
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-4 py-2 text-lg font-medium text-white hover:text-indigo-200 transition duration-300 ${
                  isActive ? 'font-bold underline' : ''
                }`
              }
            >
              Register
            </NavLink>
          </div>
        ) : (
          <div className="flex items-center gap-4 ml-6">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-4 py-2 text-lg font-medium text-white hover:text-indigo-200 transition duration-300 ${
                  isActive ? 'font-bold underline' : ''
                }`
              }
            >
              Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-full transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
