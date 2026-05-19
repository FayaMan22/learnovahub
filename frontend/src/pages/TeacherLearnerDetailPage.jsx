import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../api/api";

export default function TeacherLearnerDetailPage() {

  const navigate = useNavigate();

  const { learnerId } = useParams();

  const [learner, setLearner] = useState(null);

  useEffect(() => {
    api
      .get(`/teacher/learners/${learnerId}`)
      .then((response) => {
        setLearner(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [learnerId]);

  if (!learner) {
    return (
      <section className="page-section">
        <p>Loading learner...</p>
      </section>
    );
  }

  return (
    <section className="page-section">

      <h1>{learner.full_name}</h1>

      <button
        className="btn btn-secondary back-btn"
        onClick={() =>
          navigate("/teacher/learners")
        }
      >
        ← Back to My Learners
      </button>

      <div className="card">
        <h2>Learner Information</h2>

        <p>Email: {learner.email}</p>
      </div>

      <h2>Course Progress</h2>

      <div className="grid-auto">

        {learner.courses.map((course) => (
          <div key={course.id} className="card">

            <h2>{course.title}</h2>

            <p>
              Lessons Completed:
              {" "}
              {course.completed_lessons}
              /
              {course.total_lessons}
            </p>

            <p>
              Progress:
              {" "}
              {course.completion_percentage}%
            </p>

            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${course.completion_percentage}%`
                }}
              />
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}