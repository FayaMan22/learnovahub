import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminLearnersPage() {

  const [learners, setLearners] = useState([]);

  const [updatingRole, setUpdatingRole] = useState(null);

  const navigate = useNavigate();

  function fetchLearners() {
    api
      .get("/admin/users")
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

  function updateUserRole(userId, role) {

    setUpdatingRole(`${userId}-${role}`);

    api
    .patch(`/admin/users/${userId}/role`, { role })
    .then(() => {
      fetchUsers();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setUpdatingRole(null);
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

              <div className="user-actions">

                <button
                  disabled={updatingRole === `${learner.id}-learner`}
                  onClick={() =>
                    updateUserRole(learner.id, "learner")
                  }
                >
                  {updatingRole === `${learner.id}-learner`
                    ? "Updating ..."
                    : "Make Learner"}
                </button>

                <button
                  disabled={updatingRole === `${learner.id}-teacher`}
                  onClick={() =>
                    updateUserRole(learner.id, "teacher")
                  }
                >
                  {updatingRole === `${learner.id}-teacher`
                    ? "Updating..."
                    : "Make Teacher"}
                </button>
                

                <button
                  disabled={updatingRole === `${learner.id}-admin`}
                  onClick={() =>
                    updateUserRole(learner.id, "admin")
                  }
                >
                  {updatingRole === `${learner.id}-admin`
                    ? "Updating ..."
                    : "Make Admin"}
                </button>

              </div>

            </div>

          ))}
        </div>
      )}
    </section>
  );
}