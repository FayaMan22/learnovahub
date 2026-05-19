import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminLearnersPage() {

  const [learners, setLearners] = useState([]);

  const navigate = useNavigate();

  function fetchLearners() {
    api
      .get("/admin/learners")
      .then((response) => {
        setLearners(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchLearners();
  }, []);

  function promoteToTeacher(userId) {

    api
      .patch(`/admin/users/${userId}/role`, {
        role: "teacher",
      })
      .then(() => {
        fetchLearners();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeTeacherRole(userId) {

    api
      .patch(`/admin/users/${userId}/role`, {
        role: "learner",
      })
      .then(() => {
        fetchLearners();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="admin-learners-page">

      <h1>Learner Management</h1>

      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate("/admin")}
      >
        ← Back to Admin Dashboard
      </button>

      {learners.length === 0 ? (
        <p>No learners found.</p>
      ) : (
        <div className="learners-grid">

          {learners.map((learner) => (

            <div
              key={learner.id}
              className="learner-card"
            >

              <h2>{learner.full_name}</h2>

              <p>{learner.email}</p>

              <p>
                Subscription:
                {" "}
                {learner.is_subscribed
                  ? "Active"
                  : "Inactive"}
              </p>

              <p>
                Progress:
                {" "}
                {learner.progress}%
              </p>

              <p>
                Role: {learner.role}
              </p>

              <div className="lesson-actions">
                {learner.role !== "teacher" ?(
                  <button
                    className="btn btn-success"
                    onClick={() =>
                    promoteToTeacher(learner.id)
                  }
                  >
                    Promote to Teacher 
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      removeTeacherRole(learner.id)
                    }
                    >
                      Remove Teacher
                    </button> 
                )}
              </div>

              <button
                onClick={() =>
                  navigate(`/admin/learners/${learner.id}`)
                }
              >
                View Learner
              </button>

            </div>

          ))}
        </div>
      )}
    </section>
  );
}