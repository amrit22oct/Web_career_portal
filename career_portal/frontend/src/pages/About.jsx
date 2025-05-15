import React from "react";
import "../styles/about.css"; // Import the external CSS file

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about-container">
        <h1 className="about-title">About PlacementShell</h1>

        {/* Introduction Section */}
        <p className="about-intro">
          Welcome to <span className="highlight">PlacementShell</span> — your
          trusted platform connecting students and recruiters!
        </p>
        <p className="about-paragraph">
          Our mission is to make the placement process easy, transparent, and
          efficient for everyone. Whether you're a student searching for your
          dream job or a recruiter looking for top talent, PlacementShell provides
          a seamless experience.
        </p>

        {/* Features Section */}
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card job-listings">
            <h3 className="feature-title">Job Listings</h3>
            <p>Discover a wide range of job opportunities that match your skills and interests.</p>
          </div>
          <div className="feature-card resume-upload">
            <h3 className="feature-title">Resume Upload</h3>
            <p>Easily upload your resume and make it visible to potential recruiters.</p>
          </div>
          <div className="feature-card student-dashboard">
            <h3 className="feature-title">Student Dashboard</h3>
            <p>Manage your profile, applications, and job search history with a user-friendly dashboard.</p>
          </div>
          <div className="feature-card recruiter-dashboard">
            <h3 className="feature-title">Recruiter Dashboard</h3>
            <p>Recruiters can easily manage job postings, view applicants, and track applications.</p>
          </div>
          <div className="feature-card application-tracking">
            <h3 className="feature-title">Application Tracking</h3>
            <p>Track your applications and get real-time status updates to stay on top of your job search.</p>
          </div>
          <div className="feature-card job-alerts">
            <h3 className="feature-title">Job Alerts</h3>
            <p>Receive personalized job alerts based on your skills and career interests.</p>
          </div>
        </div>

        {/* Benefits Section */}
        <h2 className="section-title">Why Choose PlacementShell?</h2>
        <p className="about-paragraph">
          <span className="highlight-student">For Students:</span> We offer a user-friendly platform that helps you find jobs faster, improve your visibility to top recruiters, and manage your career progress.
        </p>
        <p className="about-paragraph">
          <span className="highlight-recruiter">For Recruiters:</span> You get access to a pool of highly qualified candidates and a streamlined process for managing job applications.
        </p>

        {/* Call to Action */}
        <div className="cta">
          <p className="cta-text">Ready to get started?</p>
          <button className="cta-button">Join PlacementShell Now</button>
        </div>

        {/* Closing */}
        <p className="closing-text">
          Thank you for trusting us. Let's build your career together!
        </p>
      </div>
    </div>
  );
};

export default About;
