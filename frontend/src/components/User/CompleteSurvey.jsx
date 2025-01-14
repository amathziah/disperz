import { useState } from 'react';
import axios from 'axios';

const CompleteSurvey = ({ surveys }) => {
  const [response, setResponse] = useState({});
  const token = localStorage.getItem('token');
  const handleCompleteSurvey = async (surveyId) => {
    try {
      const surveyResponse = response[surveyId];
      if (!surveyResponse) {
        alert('Please provide your response before submitting');
        return;
      }
      await axios.post(
        'http://localhost:5004/api/surveys/submit',
        {
          surveyId,
          answers: surveyResponse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Survey completed successfully');
    } catch (err) {
      console.error(err);
      alert('Error completing the survey');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
  <h2 className="text-2xl font-semibold text-center mb-4">Complete Surveys</h2>
  <ul className="space-y-4">
    {surveys
      .filter(
        (survey) =>
          !survey.responses.some((response) => response.userId === survey.assignedUser)
      )
      .map((survey) => (
        <li
          key={survey._id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3">{survey.name}</h3>
          <div className="space-y-3">
            {survey.questions.map((question, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-700 font-medium">{question.question}</label>
                <input
                  type="text"
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={response[survey._id]?.[index] || ''}
                  onChange={(e) =>
                    setResponse({
                      ...response,
                      [survey._id]: {
                        ...response[survey._id],
                        [index]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => handleCompleteSurvey(survey._id)}
            className="mt-4 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Complete Survey
          </button>
        </li>
      ))}
  </ul>
</div>

  );
};

export default CompleteSurvey;

  
  