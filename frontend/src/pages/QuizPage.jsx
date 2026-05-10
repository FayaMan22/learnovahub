import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function QuizPage() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios
      .get(`https://learnovahub.onrender.com//lessons/${id}/quiz`)
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

    setScore(total);

    const token = localStorage.getItem("token");

    axios
      .post(
        "https://learnovahub.onrender.com/quiz-results",
        {
          lesson_id: id,
          score: total,
          total_questions: questions.length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    </section>
  );
}