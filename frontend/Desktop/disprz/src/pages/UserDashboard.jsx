import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import CompleteSurvey from '../components/User/CompleteSurvey';
const UserDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost:5004/api/surveys/my-surveys', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSurveys(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching surveys');
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading surveys...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-semibold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md"
        >
          Logout
        </button>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Surveys</h2>
        <CompleteSurvey surveys={surveys} />
      </main>
    </div>
  );
};

export default UserDashboard;
