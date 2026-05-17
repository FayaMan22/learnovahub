import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function TeacherQuizPage() {
  const { lessonId } = useParams();

  const [questions, setQuestions] = useState([]);

  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
  });

  function fetchQuestions() {
    api
      .get(`/teacher/lessons/${lessonId}/quiz`)
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingQuestionId) {
      api
        .patch(
          `/teacher/quiz-questions/${editingQuestionId}`,
          formData
        )
        .then(() => {
          fetchQuestions();
          handleCancelEdit();
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

    api
      .post(`/teacher/lessons/${lessonId}/quiz`, formData)
      .then(() => {
        fetchQuestions();
        handleCancelEdit();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDeleteQuestion(questionId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) {
      return;
    }

    api
      .delete(`/teacher/quiz-questions/${questionId}`)
      .then(() => {
        fetchQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEditClick(item) {
    setEditingQuestionId(item.id);

    setFormData({
      question: item.question,
      option_a: item.option_a,
      option_b: item.option_b,
      option_c: item.option_c,
      option_d: item.option_d,
      correct_answer: item.correct_answer,
    });
  }

  function handleCancelEdit() {
    setEditingQuestionId(null);

    setFormData({
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "",
    });
  }

  return (
    <section className="page-section">
      <h1>Manage Quiz Questions</h1>

      <form className="lesson-form card" onSubmit={handleSubmit}>
        <h2>
          {editingQuestionId ? "Edit Question" : "Add Question"}
        </h2>

        <textarea
          name="question"
          placeholder="Question"
          value={formData.question}
          onChange={handleChange}
          required
        />

        <input
          name="option_a"
          placeholder="Option A"
          value={formData.option_a}
          onChange={handleChange}
          required
        />

        <input
          name="option_b"
          placeholder="Option B"
          value={formData.option_b}
          onChange={handleChange}
          required
        />

        <input
          name="option_c"
          placeholder="Option C"
          value={formData.option_c}
          onChange={handleChange}
          required
        />

        <input
          name="option_d"
          placeholder="Option D"
          value={formData.option_d}
          onChange={handleChange}
          required
        />

        <select
          name="correct_answer"
          value={formData.correct_answer}
          onChange={handleChange}
          required
        >
          <option value="">Select correct answer</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>

        <button className="btn btn-success" type="submit">
          {editingQuestionId ? "Update Question" : "Add Question"}
        </button>
        {editingQuestionId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="grid-auto">
        {questions.map((item) => (
          <div key={item.id} className="card">
            <h2>{item.question}</h2>

            <p>A: {item.option_a}</p>
            <p>B: {item.option_b}</p>
            <p>C: {item.option_c}</p>
            <p>D: {item.option_d}</p>

            <p>
              Correct Answer: {item.correct_answer}
            </p>

            <div className="lesson-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleEditClick(item)}
              >
                Edit Question
              </button>

              <button
                className="btn btn-danger"
                onClick={() => handleDeleteQuestion(item.id)}
              >
                Delete Question
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}