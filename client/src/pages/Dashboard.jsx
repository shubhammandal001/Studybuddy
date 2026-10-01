import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="auth-box">
      <h2>Welcome, {user.name} 👋</h2>
      <p>Yahan jaldi hi tere notes aayenge.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}