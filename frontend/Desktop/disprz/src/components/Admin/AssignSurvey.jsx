import { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AssignSurvey = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showUserList, setShowUserList] = useState(false);  // To toggle user list visibility

  useEffect(() => {
    const fetchUsersAndSurveys = async () => {
      try {
        const token = localStorage.getItem('token');

        const usersResponse = await axios.get('http://localhost:5004/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);

        const surveysResponse = await axios.get('http://localhost:5004/api/surveys/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSurveys(surveysResponse.data);
      } catch (err) {
        setError('Error fetching users or surveys');
      }
    };

    fetchUsersAndSurveys();
  }, []);

  const assignUsersToSurvey = async () => {
    if (!selectedUserIds || selectedUserIds.length === 0) {
      setError('Please select at least one user');
      return;
    }
    if (!selectedSurveyId) {
      setError('Please select a survey');
      return;
    }
  
    const token = user?.token || localStorage.getItem('token');
    
    if (!token) {
      setError('Authentication required. Please log in again.');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:5004/api/surveys/${selectedSurveyId}/assign`,
        { userIds: selectedUserIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Users assigned successfully!');
      alert('Users have been successfully assigned to the survey!');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error assigning users to survey');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-red-100 border border-red-300 rounded-md text-center">
        <p className="text-red-700">You do not have permission to assign users.</p>
      </div>
    );
  }

  const handleUserSelection = (userId) => {
    setSelectedUserIds((prevState) => {
      if (prevState.includes(userId)) {
        return prevState.filter((id) => id !== userId);
      } else {
        return [...prevState, userId];
      }
    });
  };

  const toggleUserList = () => {
    setShowUserList((prev) => !prev);
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assign Users to Survey</h2>
  
      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}
  
      {successMessage && (
        <div className="mb-3 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
  
      {/* Select Survey */}
      <div className="space-y-3">
        <h3 className="font-medium text-lg text-gray-800">Select Survey</h3>
        <select
          className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedSurveyId || ''}
          onChange={(e) => setSelectedSurveyId(e.target.value)}
        >
          <option value="" disabled>Select a survey</option>
          {surveys.length > 0 ? (
            surveys.map((survey) => (
              <option key={survey._id} value={survey._id}>
                {survey.name}
              </option>
            ))
          ) : (
            <option>No surveys found</option>
          )}
        </select>
      </div>
  
      {/* Select Users */}
      <div className="space-y-3 mt-4">
        <h3 className="font-medium text-lg text-gray-800">Select Users</h3>
        <button
          onClick={toggleUserList}
          className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {showUserList ? 'Hide Users' : 'Show Users'}
        </button>
  
        {showUserList && (
          <div className="mt-3 space-y-2">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user._id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`user-${user._id}`}
                      value={user._id}
                      checked={selectedUserIds.includes(user._id)}
                      onChange={() => handleUserSelection(user._id)}
                      className="mr-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                    />
                    <label htmlFor={`user-${user._id}`} className="text-gray-700 text-sm">{user.username}</label>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No users found.</p>
            )}
          </div>
        )}
      </div>
  
      {/* Submit Button */}
      <div className="flex justify-center mt-5">
        <button
          onClick={assignUsersToSurvey}
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Assign Users
        </button>
      </div>
    </div>
  );
  
};

export default AssignSurvey;





