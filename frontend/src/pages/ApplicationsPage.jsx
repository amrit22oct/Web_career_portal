import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const PAGE_SIZE = 5;

const statusColors = {
  pending: "bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900",
  accepted: "bg-gradient-to-r from-green-300 to-green-500 text-green-900",
  rejected: "bg-gradient-to-r from-red-300 to-red-500 text-red-900",
  withdrawn: "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900",
  unknown: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800",
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    const fetchApplications = async (page = 1) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit: PAGE_SIZE },
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
        setTotalApplications(response?.data?.total || 0);
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to fetch applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications(currentPage);
  }, [user, currentPage]);

  const confirmWithdrawPopup = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowModal(true);
  };

  const totalPages = Math.ceil(totalApplications / PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-indigo-600 text-lg font-medium">
        Loading user info...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-indigo-600 text-xl font-semibold">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-indigo-700 text-lg font-medium px-4 text-center max-w-xl mx-auto">
        {user.role === "student"
          ? "You haven't applied to any jobs or internships yet."
          : "No applications received yet."}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-lg">
        {user.role === "student"
          ? "My Job & Internship Applications"
          : "Received Applications"}
      </h1>

      <div className="space-y-8">
        {applications.map((app) => {
          const statusClass =
            statusColors[(app.status || "unknown").toLowerCase()] ||
            statusColors.unknown;

          return (
            <div
              key={app._id}
              className="bg-white border border-indigo-300 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div className="flex-1">
                {user.role === "student" ? (
                  <>
                    <h2 className="text-2xl font-semibold text-indigo-800">
                      {app.job?.title || "Job Title Unavailable"}
                    </h2>
                    <p className="text-indigo-700 mt-1 font-medium">
                      Company:{" "}
                      <span className="text-indigo-600 font-semibold">
                        {app.job?.company || "N/A"}
                      </span>
                    </p>
                    <span className="inline-block mt-2 px-4 py-1 rounded-full bg-indigo-200 text-indigo-900 font-semibold capitalize shadow-md">
                      Type: {app.job?.type || "job"}
                    </span>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold text-purple-800">
                      {app.student?.name || "Applicant Name Unavailable"}
                    </h2>
                    <p className="text-purple-700 mt-1 font-medium">
                      Email:{" "}
                      <span className="text-purple-600 font-semibold">
                        {app.student?.email || "N/A"}
                      </span>
                    </p>
                    <p className="text-purple-700 mt-1 font-medium">
                      Job Applied:{" "}
                      <span className="text-purple-600 font-semibold">
                        {app.job?.title || "N/A"}
                      </span>
                    </p>
                    <span className="inline-block mt-2 px-4 py-1 rounded-full bg-purple-200 text-purple-900 font-semibold capitalize shadow-md">
                      Type: {app.job?.type || "job"}
                    </span>
                  </>
                )}

                <p className="mt-4 font-semibold text-indigo-700">
                  Resume:{" "}
                  {app.resumeLink ? (
                    <a
                      href={app.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-700 underline hover:text-indigo-900 transition"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span className="text-indigo-400 italic">Not Provided</span>
                  )}
                </p>

                {app.coverLetter && (
                  <p className="mt-3 italic text-indigo-800 max-w-prose">{`Cover Letter: ${app.coverLetter}`}</p>
                )}
              </div>

              <div className="mt-6 sm:mt-0 sm:ml-6 flex flex-col items-start sm:items-end">
                <p
                  className={`inline-block px-5 py-2 rounded-full font-semibold ${statusClass} shadow-lg capitalize`}
                  style={{ minWidth: "130px", textAlign: "center" }}
                >
                  Status: {app.status || "Unknown"}
                </p>

                <p className="text-sm text-indigo-500 mt-2 font-medium">
                  Applied on:{" "}
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {user.role === "student" && (
                  <button
                    onClick={() => confirmWithdrawPopup(app._id)}
                    className="mt-5 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800 text-white rounded-full shadow-lg hover:from-pink-700 hover:via-pink-800 hover:to-pink-900 transition"
                  >
                    Withdraw Application
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-3 select-none flex-wrap gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2 rounded-lg border border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-5 py-2 rounded-lg border font-semibold transition ${
                  isActive
                    ? "bg-indigo-700 text-white border-indigo-700"
                    : "border-indigo-400 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-2 rounded-lg border border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-extrabold text-pink-700 mb-6">
              Confirm Withdrawal
            </h2>
            <p className="mb-8 text-gray-800 leading-relaxed">
              Are you sure you want to withdraw your application? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-6">
              <button
                className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold shadow-md transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-extrabold shadow-lg transition"
                onClick={() => {
                  // Withdraw logic goes here
                  setShowModal(false);
                }}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
