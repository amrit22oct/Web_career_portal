import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1c1c1e] text-[#eee] px-6 py-12 md:px-16 border-t border-gray-700 select-none">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3 items-center">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <p className="text-xl font-bold tracking-wider uppercase">
            &copy; 2025 Web Career Portal
          </p>
          <p className="text-sm text-gray-400 mt-2">All Rights Reserved.</p>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6">
          {[
            { href: 'https://facebook.com', icon: <FaFacebook />, color: '#3b5998', label: 'Facebook' },
            { href: 'https://twitter.com', icon: <FaTwitter />, color: '#1da1f2', label: 'Twitter' },
            { href: 'https://linkedin.com', icon: <FaLinkedin />, color: '#0077b5', label: 'LinkedIn' },
            { href: 'https://github.com', icon: <FaGithub />, color: '#ddd', label: 'GitHub' },
          ].map(({ href, icon, color, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#2a2a2d] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
              style={{ color: color }}
            >
              <span className="text-2xl">{icon}</span>
            </a>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-3 md:gap-6 text-sm font-semibold uppercase text-[#bbb]">
          <a
            href="/contact"
            className="hover:text-white transition-transform transform hover:scale-110"
          >
            Contact Us
          </a>
          <span className="hidden md:inline text-gray-600">|</span>
          <a
            href="/privacy"
            className="hover:text-white transition-transform transform hover:scale-110"
          >
            Privacy Policy
          </a>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        Made with ❤️ for career aspirants.
      </div>
    </footer>
  );
};

export default Footer;
