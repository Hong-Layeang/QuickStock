import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-xl mx-auto text-center mt-24">
        <h1 className="text-4xl font-semibold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 text-lg mb-6">
          You do not have permission to view this page. Please <Link to="/" className="text-blue-600 underline hover:text-blue-800">log in</Link> with the appropriate credentials.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
