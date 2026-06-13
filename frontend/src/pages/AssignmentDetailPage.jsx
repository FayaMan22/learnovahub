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
        <div className="assignment-header">
          <div>
            <p className="assignment-label">
              Assignment
            </p>

            <h1>{assignment.title}</h1>
          </div>

          <span
            className={
              assignment.submitted
                ? "assignment-status submitted"
                : "assignment-status pending"
            }>
              {assignment.submitted
                ? "Submitted"
                : "Pending"
              }
            </span>
        </div>
        
        <div className="assignment-meta">
          Due:{" "}
          {assignment.due_date
            ? new Date(
              assignment.due_date
            ).toLocaleString()
            : "No due date"}
        </div>

        <div className="assignment-instructions">
          {assignment.instructions}
        </div>

        {assignment.submitted ? (
          <div className="submission-result-card">
            <h2>Your Submission</h2>

            <div className="submitted-answer">
              {assignment.answer_text}
            </div>

            <div className="result-grid">
              <div className="result-box">
                <span>Mark</span>

                <strong>
                  {assignment.mark !== null
                    ? assignment.mark
                    : "--"}
                </strong>
              </div>

              <div className="result-box">
                <span>Status</span>

                <strong>
                  {assignment.mark !== null
                    ? "Marked"
                    : "Awaiting Marking"}
                </strong>
              </div>

              <div className="feedback-box">
                <h3>Teacher Feedback</h3>

                <p>
                  {assignment.feedback ||
                    "Your teacher has not provide feedback yet."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="lesson-form" onSubmit={handleSubmit}>
            <h2>Submit Your Answer</h2>

            <textarea
              rows="10"
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