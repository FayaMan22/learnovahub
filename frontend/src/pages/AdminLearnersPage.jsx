import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLearnersPage() {

  const [learners, setLearners] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    axios
      .get("https://learnovahub.onrender.com/admin/learners", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLearners(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  return (
    <section className="admin-learners-page">

      <h1>Learner Management</h1>

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