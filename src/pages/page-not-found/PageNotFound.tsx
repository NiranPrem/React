import React from "react";
import { Link } from "react-router-dom";

const PageNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-r from-blue-200 to-purple-200 relative">
      {/* 404 Label */}
      <div className=" text-red-600 text-4xl px-3 py-1 rounded mb-4">404</div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-light text-gray-600 mb-2">
        Page Not Found
      </h1>

      {/* Message */}
      <p className="text-gray-500 max-w-md mb-6">
        Requested resource is not available right now. <br />
        Please try again later.
      </p>

      {/* Button */}
      <Link
        to="/login"
        className="bg-blue-200 text-blue-800 text-sm font-medium px-4 py-2 rounded hover:bg-blue-300 transition"
      >
        Go To Login
      </Link>
    </div>
  );
};

export default PageNotFound;
