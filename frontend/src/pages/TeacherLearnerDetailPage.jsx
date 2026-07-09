import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../api/api";
import usePageTitle from "../hooks/usePageTitle";

export default function TeacherLearnerDetailPage() {
  usePageTitle("TeacherLearner Detail");

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

      <div className="card learner-info-card">

        {learner.profile_pic_url ? (
            <img
            src={learner.profile_pic_url}
            alt={learner.full_name}
            className="learner-detail-avatar"
            />
        ) : (
            <div className="learner-detail-avatar-placeholder">
            {learner.full_name?.charAt(0)}
            </div>
        )}

        <div className="learner-info-text">
            <h2>{learner.full_name}</h2>
            <p>{learner.email}</p>
        </div>

        </div>

      <h2>Course Progress</h2>

      <div className="grid-auto">

        {learner.courses.map((course) => (
          <div key={course.id} className="card learner-progress-card">

            <h2>{course.title}</h2>

            <div className="progress-stats">

                <div className="progress-stat">
                <span className="stat-label">
                    Lessons Completed
                </span>

                <span className="stat-value">
                    {course.completed_lessons}
                    {" / "}
                    {course.total_lessons}
                </span>
                </div>

                <div className="progress-stat">
                <span className="stat-label">
                    Progress
                </span>

                <span className="stat-value">
                    {course.completion_percentage}
                    %
                </span>
                </div>

            </div>

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