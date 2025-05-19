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

  // Fetch applications
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

  // Filter applications
  useEffect(() => {
    const filtered = filter === "All"
      ? applications
      : applications.filter((app) => app.status === filter.toLowerCase());
    setFilteredApplications(filtered);
    setCurrentPage(1);
  }, [applications, filter]);

  // Update application status
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

  // Pagination
  const paginatedApps = filteredApplications.slice(
    (currentPage - 1) * applicationsPerPage,
    currentPage * applicationsPerPage
  );

  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  if (!user) return <div className="text-center mt-10">Loading user info…</div>;
  if (loading) return <div className="text-center mt-10">Loading applications…</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Received Applications</h1>

      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
      </div>

      {paginatedApps.length === 0 ? (
        <div className="text-center">No applications found for selected filter.</div>
      ) : (
        paginatedApps.map((app) => (
          <div
            key={app._id}
            className="border border-gray-300 rounded-lg p-4 shadow-sm mb-4"
          >
            <h2 className="text-xl font-semibold">{app.student?.name || "N/A"}</h2>
            <p className="text-gray-600">Email: {app.student?.email || "N/A"}</p>
            <p className="text-gray-600">University: {app.student?.university || "N/A"}</p>
            <p className="text-gray-600">Skills: {app.student?.skills?.join(", ") || "N/A"}</p>
            <p className="text-gray-600">Job: {app.job?.title || "N/A"}</p>

            <p className="mt-2">
              Resume:{" "}
              {app.resumeLink ? (
                <>
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mr-2"
                  >
                    View
                  </a>
                  <a
                    href={app.resumeLink}
                    download
                    className="text-green-600 underline"
                  >
                    Download
                  </a>
                </>
              ) : (
                "Not Provided"
              )}
            </p>

            {app.coverLetter && (
              <p className="mt-1">Cover Letter: {app.coverLetter}</p>
            )}

            {/* Status Badge */}
            <p className="mt-2">
              Status:{" "}
              <span
                className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                  app.status === "accepted"
                    ? "bg-green-200 text-green-800"
                    : app.status === "rejected"
                    ? "bg-red-200 text-red-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {app.status || "pending"}
              </span>
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                onClick={() => updateStatus(app._id, "accepted")}
                disabled={statusUpdating === app._id || app.status === "accepted"}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                onClick={() => updateStatus(app._id, "rejected")}
                disabled={statusUpdating === app._id || app.status === "rejected"}
              >
                Reject
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Applied on:{" "}
              {app.createdAt
                ? new Date(app.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
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
