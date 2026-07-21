import "./quiz-card.css";

export default function QuizCard({
  question,
  number,
  onEdit,
  onDelete,
}) {
  const options = [
    { letter: "A", text: question.option_a },
    { letter: "B", text: question.option_b },
    { letter: "C", text: question.option_c },
    { letter: "D", text: question.option_d },
  ];

  return (
    <article className="quiz-card">
      <div className="quiz-card-top">
        <span className="quiz-number">
          Question {number}
        </span>

        <span className="quiz-type">
          ☷ Multiple Choice
        </span>
      </div>

      <h2 className="quiz-question-text">
        {question.question}
      </h2>

      <div className="quiz-divider" />

      <div className="quiz-options">
        {options.map((option) => {
          const isCorrect =
            question.correct_answer === option.letter;

          return (
            <div
              key={option.letter}
              className={`quiz-option ${
                isCorrect ? "correct-option" : ""
              }`}
            >
              <span className="quiz-radio">
                {isCorrect && (
                  <span className="quiz-radio-dot" />
                )}
              </span>

              <span className="quiz-option-letter">
                {option.letter}
              </span>

              <span className="quiz-option-text">
                {option.text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="quiz-correct-answer">
        <span className="quiz-correct-icon">✓</span>

        <strong>
          Correct Answer: {question.correct_answer}
        </strong>
      </div>

      <div className="quiz-card-actions">
        <button
          type="button"
          className="quiz-action-button edit"
          onClick={onEdit}
        >
          ✎ Edit Question
        </button>

        <button
          type="button"
          className="quiz-action-button delete"
          onClick={onDelete}
        >
          🗑 Delete Question
        </button>
      </div>
    </article>
  );
}