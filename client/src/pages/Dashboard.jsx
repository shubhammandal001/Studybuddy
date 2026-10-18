import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

import api from "../api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadDocs = async () => {
    try {
      const { data } = await api.get("/documents");
      setDocs(data);
    } catch {
      setError("Could not load documents");
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/documents", formData);
      await loadDocs();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocs(docs.filter((d) => d._id !== id));
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <div className="dash">
      <Navbar/>
      <h2 className = "welcome">Welcome, {user.name} 👋🏿 </h2>

      <label className="upload-box">
        {uploading ? "Uploading..." : "+ Upload a PDF (max 10MB)"}
        <input type="file" accept="application/pdf" onChange={handleUpload} hidden disabled={uploading} />
      </label>

      {error && <p className="error">{error}</p>}

      <h3>Your documents</h3>
      {docs.length === 0 && (
         <div className="empty">📄 No Documents. Upload your Documents!</div>
      )}
      {docs.map((d) => (
        <div className="doc-item" key={d._id}>
          <div>
            <strong>{d.title}</strong>
            <small>{d.pageCount} pages</small>
          </div>
          <div className="doc-actions">
            <Link className ="chat-btn" to={`/chat/${d._id}`}>Chat</Link>
            <Link className ="chat-btn" to={`/quiz/${d._id}`}>Quiz</Link>
            <button className="danger" onClick={() => handleDelete(d._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}