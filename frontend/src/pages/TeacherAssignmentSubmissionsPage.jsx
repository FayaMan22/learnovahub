import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function TeacherAssignmentSubmissionsPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  const [submissions, setSubmissions] = useState([]);

  function fetchSubmissions() {
    api
      .get(`/teacher/assignments/${assignmentId}/submissions`)
      .then((response) => {
        setSubmissions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  function handleChange(submissionId, field, value) {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === submissionId
          ? { ...submission, [field]: value }
          : submission
      )
    );
  }

  function handleMark(submissionId) {
    const submission = submissions.find(
      (item) => item.id === submissionId
    );

    api
      .patch(`/teacher/submissions/${submissionId}/mark`, {
        mark: Number(submission.mark),
        feedback: submission.feedback
          ? submission.feedback.charAt(0).toUpperCase() +
            submission.feedback.slice(1)
          : "",
      })
      .then(() => {
        alert("Submission marked successfully.");
        fetchSubmissions();
      })
      .catch((error) => {
        console.log(error);
        alert(
          error.response?.data?.error ||
            "Failed to mark submission"
        );
      });
  }

  return (
    <section className="page-section">
      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1>Assignment Submissions</h1>

      {submissions.length === 0 && (
        <div className="card empty-state">
          <h2>No submissions yet</h2>
          <p>Learners have not submitted this assignment yet.</p>
        </div>
      )}

      <div className="grid-auto">
        {submissions.map((submission) => (
          <div key={submission.id} className="card submission-card">
            <div className="assignment-card-header">
              <div className="submission-learner-info">
                <img
                  onScroll={
                    submission.learner_profile_picture ||
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(submission.learner_name)
                  }
                  alt={submission.learner_name}
                  className="submission-avatar"
                />

                <div>
                  <p className="assignment-label">Submission</p>
                  <h2>{submission.learner_name}</h2>
                </div>
              </div>
              
              <span
                className={
                  submission.status === "marked"
                    ? "assignment-status submitted"
                    : "assignment-status pending"
                }
              >
                {submission.status}
              </span>
            </div>

            <div className="assignment-instructions">
              {submission.answer_text || "No written answer submitted."}
            </div>
            <div className="submission-meta">
                <span>
                    Submitted:{" "}
                    {submission.submitted_at
                        ? new Date(submission.submitted_at).toLocaleString()
                        : "Unknown"
                    }
                </span>
            </div>

            <div className="marking-panel">
                <h3>Assessment</h3>

                
                <div className="score-summary">
                    Score: {submission.mark ?? 0}/{submission.total_marks ?? "-"}
                </div>

                <label>
                    Mark Awarded  
                    <input
                        type="number"
                        placeholder="Enter mark"
                        value={submission.mark || ""}
                        onChange={(e) =>
                            handleChange(submission.id, "mark", e.target.value)
                        }/>  
                </label>

                <div className="total-marks-display">
                  Out of: {submission.total_marks ?? "-"}
                </div>


                <label>
                    Feedback
                    <textarea
                        rows="4"
                        placeholder="Write feedback for the learner ..."
                        value={submission.feedback || ""}
                        onChange={(e) =>
                            handleChange(submission.id, "feedback", e.target.value)
                        }/>
                </label>

                <button
                    className="btn btn-success"
                    onClick={() => handleMark(submission.id)}>
                    Save Mark & Feedback
                </button>
                
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}