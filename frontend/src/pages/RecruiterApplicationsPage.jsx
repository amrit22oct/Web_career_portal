import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const RecruiterApplicationsPage = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const applicationsPerPage = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || user.role !== "recruiter") {
        setError("Access denied. Only recruiters can view this page.");
        setLoading(false);
        return;
      }
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await API.get("/recruiter/application", config);
        setApplications(response.data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  useEffect(() => {
    const filtered = filter === "All"
      ? applications
      : applications.filter((app) => app.status === filter.toLowerCase());
    setFilteredApplications(filtered);
    setCurrentPage(1);
  }, [applications, filter]);

  const updateStatus = async (id, status) => {
    try {
      setStatusUpdating(id);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await API.patch(`recruiter/application/${id}/status`, { status }, config);
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
      setSuccessMessage(`Application ${status} successfully.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update application status.");
    } finally {
      setStatusUpdating(null);
    }
  };

  const paginatedApps = filteredApplications.slice(
    (currentPage - 1) * applicationsPerPage,
    currentPage * applicationsPerPage
  );

  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  if (!user) return <div className="text-center mt-10 text-lg text-gray-700">Loading user info…</div>;
  if (loading) return <div className="text-center mt-10 text-lg text-gray-700">Loading applications…</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-900 tracking-wide drop-shadow-md">
        Received Applications
      </h1>

      {successMessage && (
        <div className="bg-green-100 text-green-800 px-5 py-3 rounded-lg mb-6 text-center font-medium shadow-md animate-pulse">
          {successMessage}
        </div>
      )}

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-indigo-400 bg-white text-indigo-900 font-semibold rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:ring-indigo-400 transition"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
      </div>

      {paginatedApps.length === 0 ? (
        <div className="text-center text-gray-600 font-medium text-lg">
          No applications found for the selected filter.
        </div>
      ) : (
        paginatedApps.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-2xl p-6 mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-indigo-200"
          >
            <h2 className="text-2xl font-bold text-indigo-800">{app.student?.name || "N/A"}</h2>
            <p className="text-indigo-600 font-medium">Email: {app.student?.email || "N/A"}</p>
            <p className="text-indigo-600 font-medium">University: {app.student?.university || "N/A"}</p>
            <p className="text-indigo-600 font-medium">Skills: {app.student?.skills?.join(", ") || "N/A"}</p>
            <p className="text-indigo-700 font-semibold mt-2">Job: {app.job?.title || "N/A"}</p>

            <p className="mt-3 text-indigo-600">
              Resume:{" "}
              {app.resumeLink ? (
                <>
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-800 mr-3 font-semibold"
                  >
                    View
                  </a>
                  <a
                    href={app.resumeLink}
                    download
                    className="text-green-600 underline hover:text-green-800 font-semibold"
                  >
                    Download
                  </a>
                </>
              ) : (
                "Not Provided"
              )}
            </p>

            {app.coverLetter && (
              <p className="mt-3 italic text-indigo-700 border-l-4 border-indigo-400 pl-4 bg-indigo-50 rounded-md shadow-inner">
                Cover Letter: {app.coverLetter}
              </p>
            )}

            {/* Status Badge */}
            <p className="mt-4 font-semibold">
              Status:{" "}
              <span
                className={`inline-block px-3 py-1 text-sm font-bold rounded-full tracking-wide ${
                  app.status === "accepted"
                    ? "bg-green-300 text-green-900"
                    : app.status === "rejected"
                    ? "bg-red-300 text-red-900"
                    : "bg-yellow-300 text-yellow-900"
                }`}
              >
                {app.status || "pending"}
              </span>
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex gap-4">
              <button
                className={`px-5 py-2 rounded-full font-semibold shadow-md transition transform hover:scale-105 hover:shadow-xl text-white ${
                  statusUpdating === app._id || app.status === "accepted"
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={() => updateStatus(app._id, "accepted")}
                disabled={statusUpdating === app._id || app.status === "accepted"}
              >
                Accept
              </button>
              <button
                className={`px-5 py-2 rounded-full font-semibold shadow-md transition transform hover:scale-105 hover:shadow-xl text-white ${
                  statusUpdating === app._id || app.status === "rejected"
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={() => updateStatus(app._id, "rejected")}
                disabled={statusUpdating === app._id || app.status === "rejected"}
              >
                Reject
              </button>
            </div>

            <p className="text-sm text-indigo-500 mt-4 italic">
              Applied on:{" "}
              {app.createdAt
                ? new Date(app.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-indigo-200 text-indigo-700 hover:bg-indigo-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicationsPage;
