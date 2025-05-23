// Mock data for testing
const mockJobData = {
  title: "Software Engineer",
  description: "We are looking for a passionate Software Engineer to join our team. You will work on developing cutting-edge software solutions.",
  company: "Tech Solutions Inc.",
  location: "San Francisco, CA",
};

const mockUserData = {
  id: "12345",
  name: "John Doe",
  role: "applicant", // Change to 'recruiter' for testing recruiter features
};

// Simulate API service with mock data
const mockAPI = {
  get: async (url) => {
    if (url === "/jobs/12345") {
      return { data: mockJobData };
    }
    throw new Error("Job not found");
  },
};

// Simulate AuthContext for user data
const AuthContext = React.createContext();

const MockAuthContextProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: mockUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
