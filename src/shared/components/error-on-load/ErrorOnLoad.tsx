import React from 'react';
import { Link } from 'react-router-dom';

const ErrorOnLoad: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-600">500</h1>
      <p className="text-xl text-gray-700">Oops! Something went wrong.</p>
      <Link to="/login" className="mt-4 text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default ErrorOnLoad;
