import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function AdminLearnerDetailPage() {

  const { learnerId } = useParams();

  const [learner, setLearner] = useState(null);

  useEffect(() => {
    api
      .get(`/admin/learners/${learnerId}`)
      .then((response) => {
        setLearner(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [learnerId]);

  if (!learner) {
    return <p>Loading learner...</p>;
  }

  return (
    <section className="admin-learner-detail-page">

      <h1>{learner.full_name}</h1>

      <p>Email: {learner.email}</p>

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
        Lessons Completed:
        {" "}
        {learner.lessons_completed}
      </p>

      <p>
        Quizzes Passed:
        {" "}
        {learner.quizzes_passed}
      </p>

    </section>
  );
}