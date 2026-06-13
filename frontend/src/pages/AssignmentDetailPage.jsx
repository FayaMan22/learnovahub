import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function AssignmentDetailPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    api
      .get(`/assignments/${assignmentId}`)
      .then((response) => {
        setAssignment(response.data);
        setAnswerText(response.data.answer_text || "");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [assignmentId]);

  function handleSubmit(e) {
    e.preventDefault();

    api
      .post(`/assignments/${assignmentId}/submit`, {
        answer_text: answerText,
      })
      .then(() => {
        alert("Assignment submitted successfully.");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert(
          error.response?.data?.error ||
            "Failed to submit assignment"
        );
      });
  }

  if (!assignment) {
    return (
      <section className="page-section">
        <p>Loading assignment...</p>
      </section>
    );
  }

  return (
    <section className="page-section">
      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card assignment-detail-card">
        <h1>{assignment.title}</h1>

        <div className="assignment-instructions">
          {assignment.instructions}
        </div>

        <p>
          Due:{" "}
          {assignment.due_date
            ? new Date(assignment.due_date).toLocaleDateString()
            : "No due date"}
        </p>

        {assignment.submitted ? (
          <div className="submission-status-box">
            <h2>Submitted</h2>

            <p>
              <strong>Your Answer:</strong>
            </p>

            <p>{assignment.answer_text}</p>

            <p>
              <strong>Mark:</strong>{" "}
              {assignment.mark !== null
                ? assignment.mark
                : "Not marked yet"}
            </p>

            <p>
              <strong>Feedback:</strong>{" "}
              {assignment.feedback || "No feedback yet"}
            </p>
          </div>
        ) : (
          <form className="lesson-form" onSubmit={handleSubmit}>
            <h2>Submit Your Answer</h2>

            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here..."
              required
            />

            <button className="btn btn-success" type="submit">
              Submit Assignment
            </button>
          </form>
        )}
      </div>
    </section>
  );
}