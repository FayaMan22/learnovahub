import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

export default function TeacherAssignmentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");

  const [assignments, setAssignments] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    instructions: "",
    due_date: "",
  });

  function fetchAssignments() {
    if (!courseId) return;

    api
      .get(`/teacher/courses/${courseId}/assignments`)
      .then((response) => {
        setAssignments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    setFormData({
      title: "",
      instructions: "",
      due_date: "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      course_id: Number(courseId),
      lesson_id: null,
      title: formData.title,
      instructions: formData.instructions,
      due_date: formData.due_date
        ? `${formData.due_date}T23:59:00`
        : null,
    };

    api
      .post("/teacher/assignments", payload)
      .then(() => {
        fetchAssignments();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        alert(
          error.response?.data?.error ||
            "Failed to create assignment"
        );
      });
  }

  if (!courseId) {
    return (
      <section className="page-section">
        <h1>Assignments</h1>
        <p>No course selected.</p>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/teacher/courses")}
        >
          ← Back to Courses
        </button>
      </section>
    );
  }

  return (
    <section className="page-section">
      <h1>Course Assignments</h1>

      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate("/teacher/courses")}
      >
        ← Back to Courses
      </button>

      <form className="lesson-form card" onSubmit={handleSubmit}>
        <h2>Create Assignment</h2>

        <input
          type="text"
          name="title"
          placeholder="e.g. Algebra Assignment 1"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="instructions"
          placeholder="Assignment instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />

        <input
          type="number"
          name="total_marks"
          placeholder="Total marks"
          value={formData.total_marks}
          onChange={handleChange}
        />

        <button className="btn btn-success" type="submit">
          Create Assignment
        </button>
      </form>

      {assignments.length === 0 && (
        <div className="card empty-state">
          <h2>No assignments yet</h2>
          <p>Create your first assignment above.</p>
        </div>
      )}

      <div className="grid-auto">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="card assignment-card">
            <div className="assignment-card-header">
              <div>
                <p className="assignment-label">Assignment</p>
                <h2>{assignment.title}</h2>
              </div>

              <span className="assignment-status submitted">
                {assignment.submission_count} Submission
                {assignment.submission_count === 1 ? "" : "s"}
              </span>
            </div>

            <div className="assignment-instructions">
              {assignment.instructions}
            </div>

            <div className="assignment-footer">
              <span>
                Due:{" "}
                {assignment.due_date
                  ? new Date(assignment.due_date).toLocaleDateString()
                  : "No due date"}
              </span>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/teacher/assignments/${assignment.id}/submissions`)
                }
              >
                View Submissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}