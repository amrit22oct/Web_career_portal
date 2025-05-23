const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-6">
      <h1
        className="
          text-7xl sm:text-9xl
          font-extrabold
          text-transparent
          bg-clip-text
          bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600
          mb-6
          animate-pulse
          select-none
        "
      >
        404
      </h1>
      <p
        className="
          text-3xl sm:text-4xl
          font-semibold
          text-indigo-700
          mb-4
          text-center
          max-w-md
        "
      >
        Page Not Found
      </p>
      <p
        className="
          text-lg sm:text-xl
          text-indigo-500
          mb-8
          text-center
          max-w-sm
          px-4
        "
      >
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <a
        href="/"
        className="
          inline-block
          px-6 py-3
          bg-indigo-600 hover:bg-indigo-700
          text-white
          rounded-lg
          font-semibold
          shadow-lg
          transition
          duration-300
          ease-in-out
          hover:scale-105
          focus:outline-none focus:ring-4 focus:ring-indigo-300
        "
      >
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFoundPage;
