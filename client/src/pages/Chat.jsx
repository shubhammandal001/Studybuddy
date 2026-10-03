import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { question: q, documentId: id });
      setMessages((m) => [
        ...m,
        { role: "ai", text: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "ai", error: true, text: err.response?.data?.message || "Something went wrong" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <Link to="/dashboard">← Back</Link>
        <h3>Ask your notes</h3>
      </header>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="hint">Apne PDF se kuch bhi pooch, jaise "is chapter ka summary de".</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role} ${m.error ? "err" : ""}`}>
            <p>{m.text}</p>
            {m.sources?.length > 0 && (
              <details>
                <summary>Sources ({m.sources.length})</summary>
                {m.sources.map((s, j) => (
                  <blockquote key={j}>{s.text}...</blockquote>
                ))}
              </details>
            )}
          </div>
        ))}
        {loading && <div className="msg ai"><p>Soch raha hu...</p></div>}
        <div ref={bottomRef} />
      </div>

      <form className="chat-form" onSubmit={handleSend}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Apna sawal likh..."
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}