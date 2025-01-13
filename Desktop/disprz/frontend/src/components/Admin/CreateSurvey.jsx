import { useState } from 'react';
import axios from 'axios';

const CreateSurvey = () => {
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([{ type: 'text', question: '' }]);

  // Handle adding a new question
  const handleAddQuestion = () => {
    setQuestions([...questions, { type: 'text', question: '' }]);
  };

  // Handle the creation of the survey
  const handleCreateSurvey = async () => {
    const token = localStorage.getItem('token'); // Assuming JWT token is stored in localStorage

    if (!token) {
      alert('You are not logged in. Please log in first.');
      return;
    }

    try {
      // Construct the survey data
      const surveyData = {
        name,
        questions: questions.map((q) => ({
          type: q.type,
          question: q.question,
        })),
      };

      // Send the request to the backend API to create the survey with Authorization header
      const response = await axios.post(
        'http://localhost:5004/api/surveys',
        surveyData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      
      if (response.status === 201) {
        alert('Survey created successfully');
      } else {
        alert('Error creating survey');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Unauthorized. Please log in.');
      } else {
        alert('Error creating survey: ' + err.message);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Survey</h2>

      {/* Survey Name Input */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Survey Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Survey Questions */}
      <div className="space-y-4 mt-6">
        {questions.map((q, index) => (
          <div key={index} className="flex items-center space-x-4">
            {/* Question Type Selector */}
            <select
              value={q.type}
              onChange={(e) =>
                setQuestions(
                  questions.map((item, i) =>
                    i === index ? { ...item, type: e.target.value } : item
                  )
                )
              }
              className="p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="text">Text</option>
              <option value="rating">Rating</option>
            </select>

            {/* Question Input */}
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) =>
                setQuestions(
                  questions.map((item, i) =>
                    i === index ? { ...item, question: e.target.value } : item
                  )
                )
              }
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleAddQuestion}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add Question
        </button>
      </div>

      {/* Create Survey Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCreateSurvey}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Create Survey
        </button>
      </div>
    </div>
  );
};

export default CreateSurvey;
