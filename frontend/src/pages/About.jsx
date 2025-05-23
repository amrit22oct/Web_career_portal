import React from "react";
import {
  BriefcaseIcon,
  ArrowUpTrayIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto bg-gray-900 bg-opacity-70 rounded-3xl shadow-xl p-10 sm:p-14 space-y-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-400 text-center drop-shadow-lg">
          About Web Career Portal
        </h1>

        {/* Introduction */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <p className="text-lg sm:text-xl text-gray-300">
            Welcome to{" "}
            <span className="font-semibold text-teal-400">Web Career Portal</span> — your trusted platform connecting
            students and recruiters with transparency and ease!
          </p>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Our mission is to simplify the placement process and empower both students and recruiters. Whether you are
            searching for your dream job or scouting for top talent, our portal provides a seamless and efficient
            experience.
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-3xl font-bold text-center text-teal-400 mb-10 drop-shadow-md">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              Icon={BriefcaseIcon}
              title="Job Listings"
              description="Discover a wide range of job opportunities that match your skills and interests."
              bgColor="bg-gradient-to-r from-teal-500 to-teal-700"
            />
            <FeatureCard
              Icon={ArrowUpTrayIcon}
              title="Resume Upload"
              description="Easily upload your resume and make it visible to potential recruiters."
              bgColor="bg-gradient-to-r from-purple-600 to-purple-800"
            />
            <FeatureCard
              Icon={UserCircleIcon}
              title="Student Dashboard"
              description="Manage your profile, applications, and job search history easily."
              bgColor="bg-gradient-to-r from-emerald-500 to-emerald-700"
            />
            <FeatureCard
              Icon={ClipboardDocumentCheckIcon}
              title="Recruiter Dashboard"
              description="Recruiters can manage job postings and view applicants seamlessly."
              bgColor="bg-gradient-to-r from-orange-500 to-orange-700"
            />
            <FeatureCard
              Icon={ChartBarIcon}
              title="Application Tracking"
              description="Track your applications and get real-time updates on your progress."
              bgColor="bg-gradient-to-r from-yellow-400 to-yellow-600"
            />
            <FeatureCard
              Icon={BellAlertIcon}
              title="Job Alerts"
              description="Receive personalized job alerts based on your profile and preferences."
              bgColor="bg-gradient-to-r from-red-500 to-red-700"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center text-teal-400 drop-shadow-md">
            Why Choose Web Career Portal?
          </h2>
          <p className="text-gray-300 text-center text-lg leading-relaxed">
            <span className="font-semibold text-teal-400">For Students:</span> We provide a user-friendly platform to
            help you find jobs faster, increase your visibility to top recruiters, and efficiently manage your career
            journey.
          </p>
          <p className="text-gray-300 text-center text-lg leading-relaxed">
            <span className="font-semibold text-purple-500">For Recruiters:</span> Access a large pool of qualified
            candidates and streamline your hiring process with ease and precision.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-xl font-semibold text-gray-200 mb-5">Ready to get started?</p>
          <button className="bg-teal-500 hover:bg-teal-600 transition-colors text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-teal-700/50 text-lg">
            Join Web Career Portal Now
          </button>
        </div>

        {/* Closing */}
        <p className="text-center text-gray-400 text-md mt-14 mb-6">
          Thank you for trusting us. Let's build your career together!
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ Icon, title, description, bgColor }) => (
  <div
    className={`${bgColor} rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-default`}
  >
    <div className="flex items-center gap-4 mb-4">
      <Icon className="h-8 w-8 text-white drop-shadow-md" />
      <h3 className="text-xl font-semibold text-white drop-shadow-md">{title}</h3>
    </div>
    <p className="text-white/90 text-sm leading-relaxed">{description}</p>
  </div>
);

export default About;
