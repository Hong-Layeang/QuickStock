import { Link } from 'react-router-dom';

const SessionExpiredPage = () => {
  return (
    <div className="h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-xl mx-auto text-center mt-24">
        <h1 className="text-4xl font-semibold text-yellow-600 mb-4">Session Expired</h1>
        <p className="text-gray-700 text-lg mb-6">
          Your session has expired due to inactivity. Please <Link to="/" className="text-blue-600 underline hover:text-blue-800">log in</Link> again to continue.
        </p>
      </div>
    </div>
  );
};

export default SessionExpiredPage;
