import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import '../styles/footer.css'; // adjust path as needed

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 Web Career Portal. All Rights Reserved.</p>

      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="facebook" size={24} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="twitter" size={24} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="linkedin" size={24} />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <FaGithub className="github" size={24} />
        </a>
      </div>

      <div className="footer-links">
        <a href="/contact">Contact Us</a> | 
        <a href="/privacy"> Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
