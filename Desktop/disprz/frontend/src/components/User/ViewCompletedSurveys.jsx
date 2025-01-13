const ViewCompletedSurveys = ({ surveys }) => {
    return (
      <div>
        <h2>Completed Surveys</h2>
        <ul>
          {surveys
            .filter((survey) => survey.responses.some((response) => response.userId === survey.assignedUser))
            .map((survey) => (
              <li key={survey._id}>
                <h3>{survey.name}</h3>
                <p>Completed</p>
              </li>
            ))}
        </ul>
      </div>
    );
  };
  
  export default ViewCompletedSurveys;
  
