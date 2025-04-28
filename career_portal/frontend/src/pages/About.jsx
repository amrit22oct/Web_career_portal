import React from "react";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-200 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">
          About PlacementShell
        </h1>

        {/* Introduction Section */}
        <p className="text-lg text-gray-700 mb-6 text-center">
          Welcome to <span className="font-semibold">PlacementShell</span> — your
          trusted platform connecting students and recruiters!
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Our mission is to make the placement process easy, transparent, and
          efficient for everyone. Whether you're a student searching for your
          dream job or a recruiter looking for top talent, PlacementShell provides
          a seamless experience.
        </p>

        {/* Features Section */}
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Job Listings</h3>
            <p>
              Discover a wide range of job opportunities that match your skills
              and interests.
            </p>
          </div>
          <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Resume Upload</h3>
            <p>
              Easily upload your resume and make it visible to potential
              recruiters.
            </p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Student Dashboard</h3>
            <p>
              Manage your profile, applications, and job search history with a
              user-friendly dashboard.
            </p>
          </div>
          <div className="bg-orange-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Recruiter Dashboard</h3>
            <p>
              Recruiters can easily manage job postings, view applicants, and
              track applications.
            </p>
          </div>
          <div className="bg-yellow-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Application Tracking</h3>
            <p>
              Track your applications and get real-time status updates to stay
              on top of your job search.
            </p>
          </div>
          <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Job Alerts</h3>
            <p>
              Receive personalized job alerts based on your skills and career
              interests.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <h2 className="text-2xl font-semibold text-blue-700 mt-10 mb-6 text-center">
          Why Choose PlacementShell?
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold text-blue-600">For Students:</span> We offer a user-friendly platform that helps you find jobs faster, improve your visibility to top recruiters, and manage your career progress.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold text-purple-600">For Recruiters:</span> You get access to a pool of highly qualified candidates and a streamlined process for managing job applications.
        </p>

        {/* Call to Action Section */}
        <div className="text-center mt-12">
          <p className="text-xl text-gray-700 mb-6">Ready to get started?</p>
          <button className="bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700 transition duration-300">
            Join PlacementShell Now
          </button>
        </div>

        {/* Closing Section */}
        <p className="text-lg text-gray-700 mt-12 text-center">
          Thank you for trusting us. Let's build your career together!
        </p>
      </div>
    </div>
  );
};

export default About;
