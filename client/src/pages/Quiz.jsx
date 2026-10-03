import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function Quiz() {
  const { id } = useParams();
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/quiz", { documentId: id, count });
      setQuestions(data.questions);
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setFinished(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const choose = (i) => {
    if (selected !== null) return; // ek hi baar chun sakte hain
    setSelected(i);
    if (i === questions[current].answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setQuestions([]);
    setFinished(false);
  };

  const q = questions[current];

  return (
    <div className="quiz-page">
      <header className="chat-header">
        <Link to="/dashboard">← Back</Link>
        <h3>Quiz</h3>
      </header>

      {error && <p className="error">{error}</p>}

      {/* 1. Start screen */}
      {questions.length === 0 && (
        <div className="quiz-card">
          <p>Apne notes se quiz banao. Kitne sawal?</p>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            <option value={5}>5 questions</option>
            <option value={8}>8 questions</option>
            <option value={10}>10 questions</option>
          </select>
          <button onClick={startQuiz} disabled={loading}>
            {loading ? "Quiz ban raha hai..." : "Start Quiz"}
          </button>
        </div>
      )}

      {/* 2. Result screen */}
      {questions.length > 0 && finished && (
        <div className="quiz-card">
          <h2>Score: {score} / {questions.length} 🎉</h2>
          <button onClick={reset}>New Quiz</button>
        </div>
      )}

      {/* 3. Question screen */}
      {questions.length > 0 && !finished && (
        <div className="quiz-card">
          <small>Question {current + 1} of {questions.length}</small>
          <h3>{q.question}</h3>

          {q.options.map((opt, i) => {
            let cls = "opt";
            if (selected !== null) {
              if (i === q.answerIndex) cls += " correct";
              else if (i === selected) cls += " wrong";
              else cls += " dim";
            }
            return (
              <button key={i} className={cls} onClick={() => choose(i)}>
                {opt}
              </button>
            );
          })}

          {selected !== null && (
            <>
              <p className="explain">💡 {q.explanation}</p>
              <button onClick={next}>
                {current + 1 === questions.length ? "Finish" : "Next"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}