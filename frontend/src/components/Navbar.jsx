import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItemStyle = ({ isActive }) =>
    `px-4 py-2 text-base md:text-lg font-medium rounded-md transition duration-300 
     ${
       isActive
         ? 'bg-white bg-opacity-20 text-white font-bold shadow-inner'
         : 'text-white hover:text-indigo-200 hover:bg-white hover:bg-opacity-10'
     }`;

  const navLinks = useMemo(() => (
    <>
      <NavLink to="/" className={navItemStyle} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
      <NavLink to="/jobs" className={navItemStyle} onClick={() => setIsMobileMenuOpen(false)}>Jobs</NavLink>
      <NavLink to="/internships" className={navItemStyle} onClick={() => setIsMobileMenuOpen(false)}>Internships</NavLink>
      <NavLink to="/about" className={navItemStyle} onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
      {user && (
        <NavLink
          to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard'}
          className={navItemStyle}
          onClick={() => setIsMobileMenuOpen(false)}
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
    <nav className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 shadow-lg px-4 sm:px-6 md:px-8 py-4 relative z-50 backdrop-blur-md bg-opacity-80 overflow-hidden">
      <div className="flex justify-between items-center max-w-7xl mx-auto flex-nowrap">
        {/* Logo */}
        <NavLink
          to="/"
          className="whitespace-nowrap text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wide hover:text-indigo-300 transition flex-shrink-0 min-w-[180px] mr-8"
        >
          Web Career Portal
        </NavLink>

        {/* Mobile + Tablet Menu Button (visible below lg) */}
        <div className="lg:hidden flex-shrink-0">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none hover:text-indigo-300 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Navigation (visible lg and up) */}
        <div
          className="hidden lg:flex items-center gap-6 flex-grow justify-end whitespace-nowrap"
          style={{ minWidth: 0 }} // helps flex-shrink inside
        >
          <div className="flex items-center gap-4 lg:gap-6 min-w-0 overflow-x-auto no-scrollbar">
            {navLinks}
          </div>

          {!user ? (
            <div className="flex items-center gap-3 ml-6 whitespace-nowrap">
              <NavLink to="/login" className={navItemStyle}>Login</NavLink>
              <NavLink to="/register" className={navItemStyle}>Register</NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-6 whitespace-nowrap">
              <NavLink to="/profile" className={navItemStyle}>Profile</NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-full transition whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile + Tablet Navigation Dropdown (visible below lg) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 flex flex-col items-start gap-2 animate-slide-down max-w-full overflow-x-auto px-2">
          {navLinks}
          {!user ? (
            <>
              <NavLink
                to="/login"
                className={navItemStyle}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={navItemStyle}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className={navItemStyle}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-full transition whitespace-nowrap w-full text-center"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        /* Hide scrollbar but keep scrolling on overflow-x-auto container */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
