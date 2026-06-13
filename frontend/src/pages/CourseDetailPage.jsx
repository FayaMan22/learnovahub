import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailPage() {
  const navigate = useNavigate();

  const { courseId } = useParams();

  const { token, user } = useAuth();

  const [course, setCourse] = useState(null);

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    api
      .get(`/courses/${courseId}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [courseId]);

  useEffect(() => {
    if (!token || user?.role !== "learner") {
      return;
    }

    api
      .get(`/courses/${courseId}/assignments`)
      .then((response) => {
        setAssignments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [courseId, token, user]);;

    if (!course) {
      return (
        <section className="page-section">
          <p>Loading course...</p>
        </section>
      );
    }

  async function handleEnroll() {
    if (!token) {
      alert("Please login first.");
      return;
    }

    if (user?.role !== "learner") {
      alert("Only learners can enroll in courses.");
      return;
    }

    if (Number(course.price) === 0) {
      try {
        await api.post(`/courses/${courseId}/enroll-free`);
        alert("You have been enrolled successfully.");
        navigate("/my-courses");
      } catch (error) {
        console.log(error);
        alert(
          error.response?.data?.error ||
            "Failed to enroll in course."
        );
      }

      return;
    }

    navigate(`/pricing?course=${courseId}`);
  }

  return (
    <section className="page-section">
      <div className="course-hero card">
        <h1>{course.title}</h1>

        <button
          className="btn btn-secondary back-course-btn"
          onClick={() => navigate("/courses")}
        >
          ← Back to Courses
        </button>

        <p className="course-description">
            {course.description}
        </p>

        {course.learning_outcomes && (
          <div className="course-overview-box">
            <h2>What You'll Learn</h2>

            <ul className="course-outcomes-list">
              {course.learning_outcomes
                .split("\n")
                .filter((item) => item.trim() !== "")
                .map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
          </div>
        )}

        {user?.role === "learner" && assignments.length > 0 && (
          <>
            <h2 className="section-title">
              Course Assignments
            </h2>

            <div className="course-lessons-grid">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="card assignment-card"
                >
                  <div className="assignment-card-header">
                    <div>
                      <p className="assignment-label">
                        Assignment
                      </p>

                      <h2>{assignment.title}</h2>
                    </div>

                    <span
                      className={
                        assignment.submitted
                          ? "assignment-status submitted"
                          : "assignment-status pending"
                      }
                    >
                      {assignment.submitted
                        ? "Submitted"
                        : "Pending"}
                    </span>
                  </div>

                  <div className="assignment-instructions">
                    {assignment.instructions}
                  </div>

                  <div className="assignment-footer">
                    <span>
                      Due:{" "}
                      {assignment.due_date
                        ? new Date(
                            assignment.due_date
                          ).toLocaleDateString()
                        : "No due date"}
                    </span>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(
                          `/assignments/${assignment.id}`
                        )
                      }
                    >
                      {assignment.submitted
                        ? "View Submission"
                        : "Submit Assignment"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="course-meta">
            <span>
            Teacher: {course.teacher_name}
            </span>

            <span>
            Price: R{course.price}
            </span>
        </div>

        {user?.role === "learner" && (
            <button
            className="btn btn-success enroll-btn"
            onClick={handleEnroll}
            >
            Enroll in Course
            </button>
        )}
      </div>
      <h2 className="section-title">
        Course Lessons
      </h2>

      <div className="course-lessons-grid">
        {course.lessons.map((lesson) => (
            <div key={lesson.id} className="card lesson-preview-card">

              <div className="lesson-preview-header">
                <h2>{lesson.title}</h2>

                <span className="lesson-topic-badge">
                  {lesson.topic}
                </span>
              </div>

              <p className="lesson-preview-description">
                {lesson.description}
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/lessons/${lesson.id}`)
                }
              >
                Start Learning
              </button>

            </div>
          ))}
      </div>
    </section>
  );
}