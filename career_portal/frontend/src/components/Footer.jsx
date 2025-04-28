import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 Web Career Portal. All Rights Reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-white hover:text-blue-500" size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white hover:text-blue-400" size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-white hover:text-blue-700" size={24} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-white hover:text-gray-400" size={24} />
          </a>
        </div>
        <div className="mt-4">
          <a href="/contact" className="text-white hover:text-blue-500">Contact Us</a> | 
          <a href="/privacy" className="text-white hover:text-blue-500"> Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
