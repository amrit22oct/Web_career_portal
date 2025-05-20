import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, error: authError } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset local error
    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password.");
    }
  };

  // Sync context error with local error
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fadeIn"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Welcome Back
        </h2>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full placeholder-gray-500 text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full placeholder-gray-500 text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 text-sm text-indigo-600 cursor-pointer"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold w-full py-3 rounded-lg transition duration-300"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
