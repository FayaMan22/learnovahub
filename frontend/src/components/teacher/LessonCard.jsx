import "./lesson-card.css";

export default function LessonCard({
  lesson,
  onEdit,
  onDelete,
  onManageQuiz,
}) {
  const quizCount = lesson.quiz_question_count || 0;

  return (
    <div className="card lesson-card">
      <div className="lesson-card-header">
        <h2>{lesson.title}</h2>

        <span
          className={`lesson-badge ${
            lesson.is_premium ? "premium" : "free"
          }`}
        >
          {lesson.is_premium ? "Premium" : "Free"}
        </span>
      </div>

      <p className="lesson-topic">{lesson.topic}</p>

      <p className="lesson-course">
        <strong>Course:</strong>{" "}
        {lesson.course_title || "Unassigned"}
      </p>

      <p className="lesson-description">
        {lesson.description}
      </p>

      <div className="lesson-meta">
        <span>
          {quizCount} Quiz Question
          {quizCount !== 1 ? "s" : ""}
        </span>

        <span
          className={`lesson-status ${
            quizCount > 0 ? "ready" : "pending"
          }`}
        >
          {quizCount > 0 ? "Quiz Ready" : "No Quiz"}
        </span>
      </div>

      <div className="lesson-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onEdit}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          Delete
        </button>

        <button
          type="button"
          className={
            quizCount > 0
              ? "btn btn-primary"
              : "btn btn-success"
          }
          onClick={onManageQuiz}
        >
          {quizCount > 0 ? "Manage Quiz" : "Create Quiz"}
        </button>
      </div>
    </div>
  );
}