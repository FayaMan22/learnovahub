import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import usePageTitle from "../hooks/usePageTitle";

export default function AdminSubscriptionsPage() {
  usePageTitle("Subscription");
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  function fetchUsers() {
    api
      .get("/admin/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch(() => {
        console.log("Failed to fetch users");
      });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function activateSubscription(userId) {
    api
      .patch(`/admin/users/${userId}/subscription`, {
        is_subscribed: true,
        subscription_type: "monthly",
      })
      .then(() => {
        fetchUsers();
      })
      .catch(() => {
        console.log("Failed to update subscription");
      });
  }

  function deactivateSubscription(userId) {
    api
      .patch(`/admin/users/${userId}/subscription`, {
        is_subscribed: false,
        subscription_type: null,
      })
      .then(() => {
        fetchUsers();
      })
      .catch(() => {
        console.log("Failed to update subscription");
      });
  }

  return (
    <section className="page-section">
      <h1>Subscription Management</h1>

      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate("/admin")}
      >
        ← Back to Admin Dashboard
      </button>

      <div className="grid-auto">
        {users
            .filter((user) => user.role === "learner")
            .map((user) => (
            <div key={user.id} className="card subscription-card">
                <h2>{user.full_name}</h2>

                <p>{user.email}</p>

                <p>
                Role: {user.role}
                </p>

                <p>
                Status:{" "}
                {user.is_subscribed
                    ? `Subscribed (${user.subscription_type})`
                    : "Not Subscribed"}
                </p>

                {user.is_subscribed ? (
                <button
                    className="btn btn-danger"
                    onClick={() => deactivateSubscription(user.id)}
                >
                    Deactivate
                </button>
                ) : (
                <button
                    className="btn btn-success"
                    onClick={() => activateSubscription(user.id)}
                >
                    Activate Monthly
                </button>
                )}
            </div>
        ))}
      </div>
    </section>
  );
}