import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";


export default function TeacherLearnersPage() {
  const [learners, setLearners] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/teacher/learners")
      .then((response) => {
        setLearners(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className="page-section">
      <h1>My Learners</h1>

      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate("/teacher")}
      >
        ← Back to Teacher Dashboard
      </button>

      {learners.length === 0 && (
        <div className="card empty-state">
          <h2>No learners yet</h2>
          <p>
            Learners will appear here once they enroll in your courses.
          </p>
        </div>
      )}

      <div className="grid-auto">
        {learners.map((learner) => (
          <div key={learner.id} className="card">
            <h2>{learner.full_name}</h2>

            <p>{learner.email}</p>

            <h3>Enrolled Courses</h3>

            {learner.courses.map((course) => (
              <p key={course.id}>
                {course.title}
              </p>
            ))}
            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(`/teacher/learners/${learner.id}`)
              }
            >
              View Learner
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}