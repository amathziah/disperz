import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import AddUser from '../components/Admin/AddUser';
import CreateSurvey from '../components/Admin/CreateSurvey';
import AssignSurvey from '../components/Admin/AssignSurvey';
import ViewSurveys from '../components/Admin/ViewSurveys';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    alert('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h2 className="text-white text-2xl font-semibold">Admin Dashboard</h2>
          <div className="space-x-4">
            <Link
              to="/admin/add-user"
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              Add User
            </Link>
            <Link
              to="/admin/create-survey"
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              Create Survey
            </Link>
            <Link
              to="/admin/assign-survey"
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              Assign Survey
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-center mb-8">Admin Dashboard</h1>
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">
            Welcome to the Admin Dashboard! This centralized hub allows administrators to efficiently manage the system, streamline workflows, and oversee various operations. From adding new users to creating and assigning surveys, everything is designed to ensure smooth and effective management.
          </p>
        </div>
        <Routes>
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/create-survey" element={<CreateSurvey />} />
          <Route path="/assign-survey" element={<AssignSurvey />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
