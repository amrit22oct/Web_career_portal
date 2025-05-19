// src/pages/ApplicationsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        let response;

        if (user.role === "student") {
          response = await API.get("/student/applied", config);
        } else if (user.role === "recruiter") {
          response = await API.get("/recruiter/application", config);
        } else {
          throw new Error("Invalid user role");
        }

        setApplications(response?.data?.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to fetch applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  if (!user) {
    return <div className="text-center mt-10 text-gray-600">Loading user info...</div>;
  }

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading applications...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        {user.role === "student"
          ? "You haven't applied to any jobs or internships yet."
          : "No applications received yet."}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {user.role === "student" ? "My Job & Internship Applications" : "Received Applications"}
      </h1>

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            {user.role === "student" ? (
              <>
                <h2 className="text-xl font-semibold">
                  {app.job?.title || "Job Title Unavailable"}
                </h2>
                <p className="text-gray-600">Company: {app.job?.company || "N/A"}</p>
                <p className="text-sm text-blue-500 capitalize">
                  Type: {app.job?.type || "job"} {/* type: "job" or "internship" */}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">
                  {app.student?.name || "Applicant Name Unavailable"}
                </h2>
                <p className="text-gray-600">Email: {app.student?.email || "N/A"}</p>
                <p className="text-gray-600">Job Applied: {app.job?.title || "N/A"}</p>
                <p className="text-sm text-blue-500 capitalize">
                  Type: {app.job?.type || "job"} {/* assuming job.type = "job" or "internship" */}
                </p>
              </>
            )}

            <p className="mt-2">
              Resume:{" "}
              {app.resumeLink ? (
                <a
                  href={app.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              ) : (
                "Not Provided"
              )}
            </p>

            {app.coverLetter && <p className="mt-1">Cover Letter: {app.coverLetter}</p>}

            <p className="mt-1">
              Status:{" "}
              <span className="capitalize font-medium">{app.status || "Unknown"}</span>
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Applied on:{" "}
              {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPage;
