import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 bg-gradient-to-r from-blue-200 to-purple-200">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose">
            <p className="mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                1. Information We Collect
              </h2>
              <p>
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Profile information</li>
              </ul>
            </section>
            {/* Add more sections as needed */}
          </div>
          <div className="mt-8">
            <Link to="/login" className="text-blue-500 hover:text-blue-600">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
