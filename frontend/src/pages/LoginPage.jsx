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
    setError("");
    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password.");
    }
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          bg-opacity-90
          backdrop-blur-md
          shadow-2xl
          rounded-3xl
          p-10
          max-w-md
          w-full
          animate-fadeIn
          border border-indigo-300
        "
      >
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 tracking-wide">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-lg mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-indigo-700 font-semibold mb-2 text-lg">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              border border-indigo-300
              rounded-xl
              p-4
              w-full
              text-indigo-900
              placeholder-indigo-400
              focus:outline-none
              focus:ring-4
              focus:ring-indigo-400
              transition
              shadow-sm
            "
            required
          />
        </div>

        <div className="mb-8 relative">
          <label className="block text-indigo-700 font-semibold mb-2 text-lg">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              border border-indigo-300
              rounded-xl
              p-4
              w-full
              text-indigo-900
              placeholder-indigo-400
              focus:outline-none
              focus:ring-4
              focus:ring-indigo-400
              transition
              shadow-sm
            "
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-indigo-600
              font-semibold
              hover:text-indigo-800
              transition
              select-none
              focus:outline-none
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="
            w-full
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            font-extrabold
            py-4
            rounded-2xl
            shadow-lg
            transition
            duration-300
            focus:outline-none
            focus:ring-4
            focus:ring-indigo-400
          "
        >
          Login
        </button>

        <p className="text-center text-indigo-700 mt-8 text-sm sm:text-base">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-pink-600 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
