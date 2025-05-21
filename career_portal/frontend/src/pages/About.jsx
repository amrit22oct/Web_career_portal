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
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10 sm:p-14 space-y-10">
        <h1 className="text-4xl font-extrabold text-blue-800 text-center">
          About Placement Cell
        </h1>

        {/* Introduction */}
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-700">
            Welcome to <span className="font-semibold">Placement Cell</span> — your trusted platform connecting students and recruiters!
          </p>
          <p className="text-md text-gray-600 max-w-3xl mx-auto">
            Our mission is to make the placement process easy, transparent, and efficient. Whether you're a student searching for your dream job or a recruiter looking for top talent, Placement Cell provides a seamless experience.
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              Icon={BriefcaseIcon}
              title="Job Listings"
              description="Discover a wide range of job opportunities that match your skills and interests."
              bgColor="bg-blue-600"
            />
            <FeatureCard
              Icon={ArrowUpTrayIcon}
              title="Resume Upload"
              description="Easily upload your resume and make it visible to potential recruiters."
              bgColor="bg-purple-600"
            />
            <FeatureCard
              Icon={UserCircleIcon}
              title="Student Dashboard"
              description="Manage your profile, applications, and job search history easily."
              bgColor="bg-emerald-600"
            />
            <FeatureCard
              Icon={ClipboardDocumentCheckIcon}
              title="Recruiter Dashboard"
              description="Recruiters can manage job postings and view applicants seamlessly."
              bgColor="bg-orange-500"
            />
            <FeatureCard
              Icon={ChartBarIcon}
              title="Application Tracking"
              description="Track your applications and get real-time updates on your progress."
              bgColor="bg-yellow-500"
            />
            <FeatureCard
              Icon={BellAlertIcon}
              title="Job Alerts"
              description="Receive personalized job alerts based on your profile and preferences."
              bgColor="bg-red-600"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-700 text-center">
            Why Choose Placement Cell?
          </h2>
          <p className="text-gray-700 text-md text-center">
            <span className="font-semibold text-blue-600">For Students:</span> We offer a user-friendly platform that helps you find jobs faster, improve your visibility to top recruiters, and manage your career progress.
          </p>
          <p className="text-gray-700 text-md text-center">
            <span className="font-semibold text-purple-600">For Recruiters:</span> Access a pool of highly qualified candidates and streamline the hiring process.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <p className="text-xl font-medium text-gray-800 mb-4">Ready to get started?</p>
          <button className="bg-blue-600 hover:bg-blue-800 transition text-white font-semibold py-3 px-6 rounded-full shadow-lg">
            Join Placement Cell Now
          </button>
        </div>

        {/* Closing */}
        <p className="text-center text-gray-600 text-md mt-10">
          Thank you for trusting us. Let's build your career together!
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ Icon, title, description, bgColor }) => (
  <div className={`rounded-xl text-white p-6 shadow-md hover:scale-[1.03] transition-transform duration-300 ${bgColor}`}>
    <div className="flex items-center gap-3 mb-3">
      <Icon className="h-7 w-7" />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-sm text-white/90">{description}</p>
  </div>
);

export default About;
