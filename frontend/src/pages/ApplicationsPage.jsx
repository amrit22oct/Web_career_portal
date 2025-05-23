import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const PAGE_SIZE = 5; // Number of apps per page

const statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  accepted: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
  withdrawn: "bg-gray-300 text-gray-700",
  unknown: "bg-gray-200 text-gray-800",
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const { user } = useContext(AuthContext);

  // Pagination state
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit: PAGE_SIZE,
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

        // Expect API to return paginated data like { applications: [...], total: number }
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
      <div className="text-center mt-10 text-gray-600 text-lg font-medium">
        {user.role === "student"
          ? "You haven't applied to any jobs or internships yet."
          : "No applications received yet."}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
        {user.role === "student" ? "My Job & Internship Applications" : "Received Applications"}
      </h1>

      <div className="space-y-8">
        {applications.map((app) => {
          const statusClass = statusColors[(app.status || "unknown").toLowerCase()] || statusColors.unknown;
          return (
            <div
              key={app._id}
              className="border border-indigo-300 rounded-xl p-6 shadow-lg bg-white hover:shadow-2xl transition duration-300"
            >
              {user.role === "student" ? (
                <>
                  <h2 className="text-2xl font-semibold text-indigo-700">{app.job?.title || "Job Title Unavailable"}</h2>
                  <p className="text-gray-700 mt-1 font-medium">Company: <span className="text-indigo-500">{app.job?.company || "N/A"}</span></p>
                  <p className="inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">
                    Type: {app.job?.type || "job"}
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() => confirmWithdrawPopup(app._id)}
                      className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition"
                    >
                      Withdraw Application
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-purple-700">{app.student?.name || "Applicant Name Unavailable"}</h2>
                  <p className="text-gray-700 mt-1 font-medium">Email: <span className="text-purple-500">{app.student?.email || "N/A"}</span></p>
                  <p className="text-gray-700 mt-1 font-medium">Job Applied: <span className="text-purple-500">{app.job?.title || "N/A"}</span></p>
                  <p className="inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 capitalize">
                    Type: {app.job?.type || "job"}
                  </p>
                </>
              )}

              <p className="mt-3 font-semibold">
                Resume:{" "}
                {app.resumeLink ? (
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-800"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-500 italic">Not Provided</span>
                )}
              </p>

              {app.coverLetter && (
                <p className="mt-2 italic text-gray-700 max-w-prose">Cover Letter: {app.coverLetter}</p>
              )}

              <p className={`mt-3 inline-block px-3 py-1 rounded-full font-semibold ${statusClass} capitalize`}>
                Status: {app.status || "Unknown"}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Applied on: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-3 select-none">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed`}
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
                className={`px-3 py-1 rounded-md border font-semibold ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-indigo-400 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-lg text-white">
            <h2 className="text-lg font-semibold mb-4">Confirm Withdrawal</h2>
            <p>Are you sure you want to withdraw this application?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-600 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const config = {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    };
                    await API.delete(`/student/application/${selectedApplicationId}`, config);
                    setApplications((prev) =>
                      prev.filter((app) => app._id !== selectedApplicationId)
                    );
                    setShowModal(false);
                    setSelectedApplicationId(null);
                  } catch (err) {
                    console.error("Error withdrawing application:", err);
                    alert("Failed to withdraw the application. Please try again.");
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
