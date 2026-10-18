import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <span>📚</span>
        <span className="brand-text">StudyBuddy</span>
      </div>
      <div className="nav-right">
        <span className="nav-user">{user?.name}</span>
        <button className="danger" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}