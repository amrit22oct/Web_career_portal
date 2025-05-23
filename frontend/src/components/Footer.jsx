import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#222222] text-[#eee] py-10 px-8 md:px-20 border-t border-gray-700 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        {/* Left Text */}
        <p className="text-lg font-semibold tracking-wide uppercase">
          &copy; 2025 Web Career Portal. All Rights Reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-6">
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
              className="
                w-12 h-12
                flex items-center justify-center
                rounded-full
                bg-[#333333]
                text-[#bbb]
                transition-colors duration-300
                hover:text-white
                hover:bg-[#444444]
                hover:scale-110
              "
              style={{ color: color }}
            >
              <span className="text-2xl">{icon}</span>
            </a>
          ))}
        </div>

        {/* Links */}
        <div className="text-[#bbb] flex gap-6 uppercase font-semibold tracking-wide text-sm">
          <a
            href="/contact"
            className="hover:text-white hover:scale-110 transition-transform duration-300"
          >
            Contact Us
          </a>
          <span className="text-gray-600">|</span>
          <a
            href="/privacy"
            className="hover:text-white hover:scale-110 transition-transform duration-300"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
