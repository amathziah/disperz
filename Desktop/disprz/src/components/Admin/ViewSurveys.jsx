import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Adjust the path as needed

const ViewSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const { user, token } = useContext(AuthContext); // Access token from context
  console.log("User in context:", user);

  useEffect(() => {
    const fetchSurveys = async () => {
      console.log("Fetching surveys...");
      if (!token) { // Use the token from context
        alert('User is not authenticated');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5004/api/surveys/my-surveys', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token from context
          },
        });
        console.log("Response from API:", response);
        setSurveys(response.data);
      } catch (err) {
        alert('Error fetching surveys');
        console.error("Error fetching surveys:", err);
      }
    };

    fetchSurveys();
  }, [token]); // Re-run the effect when token changes

  return (
    <div>
      <h2>All Surveys</h2>
      <ul>
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <li key={survey._id}>
              <h3>{survey.name}</h3>
              <ul>
                {survey.questions.map((q, idx) => (
                  <li key={idx}>{q.question}</li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p>No surveys available</p>
        )}
      </ul>
    </div>
  );
};

export default ViewSurveys;
