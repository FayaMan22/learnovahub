import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams } from "react-router-dom";

export default function QuizPage() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    api
      .get(`/lessons/${id}/quiz`)
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  function handleAnswer(questionId, selectedOption) {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  }

  function handleSubmit() {
    let total = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        total += 1;
      }
    });

    const review = questions.map((question) => {
      const selectedAnswer = answers[question.id];

      return {
        question: question.question,
        selected_answer: selectedAnswer || "Not answered",
        correct_answer: question.correct_answer,
        is_correct: selectedAnswer === question.correct_answer,
      };
    });

    setReviewData(review);

    setScore(total);
    api
      .post(
        "/quiz-results",
        {
          lesson_id: id,
          score: total,
          total_questions: questions.length,
        },
      )
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="quiz-page">
      <h1>Lesson Quiz</h1>

      {questions.map((question, index) => (
        <div key={question.id} className="quiz-card">
          <h2>
            Question {index + 1}: {question.question}
          </h2>

          {["A", "B", "C", "D"].map((option) => (
            <label key={option} className="quiz-option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                onChange={() =>
                  handleAnswer(question.id, option)
                }
              />
              {option}. {question[`option_${option.toLowerCase()}`]}
            </label>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button className="submit-quiz-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}

      {score !== null && (
        <div className="score-box">
          You scored {score} out of {questions.length}
        </div>
      )}

      {reviewData.length > 0 && (
        <div className="review-section">
          <h2>Quiz Review</h2>

          {reviewData.map((item, index) => (
            <div
              key={index}
              className={`review-card ${
                item.is_correct ? "correct-review" : "wrong-review"
              }`}
            >
              <h3>
                Question {index + 1}: {item.question}
              </h3>

              <p>
                Your Answer: {item.selected_answer}
              </p>

              <p>
                Correct Answer: {item.correct_answer}
              </p>

              <strong>
                {item.is_correct ? "Correct" : "Incorrect"}
              </strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}