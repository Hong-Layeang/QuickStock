import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, RefreshCw } from 'lucide-react';

const SessionExpiredPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-yellow-100 rounded-full">
              <Clock className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Session Expired</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your session has expired due to inactivity. Please log in again to continue using the application.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <RefreshCw className="h-4 w-4" />
              Login Again
            </Link>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              For security reasons, sessions expire after 30 minutes of inactivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredPage;
