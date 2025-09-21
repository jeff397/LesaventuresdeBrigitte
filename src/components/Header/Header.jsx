import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { slugify } from "../../utils/slugify";
import { useState } from "react";
import Modal from "../Modal/Modal"; // Ton composant modal
import LoginForm from "../LoginForm/LoginForm";

import "./header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const blogs = [
    "Villers-sur-Authie",
    "D'hier et d'aujourd'hui",
    "Somme-photos",
  ];

  return (
    <header>
      <nav>
        <h1>Planète Brigitte</h1>
        <ul>
          <li>
            {/* On passe un state pour réinitialiser la catégorie */}
            <Link to="/" state={{ resetCategory: true }}>
              Accueil
            </Link>
          </li>

          {blogs.map((blog) => (
            <li key={blog}>
              <Link to={`/blog/${slugify(blog)}`}>{blog}</Link>
            </li>
          ))}

          {isAdmin && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}

          <li>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="log-btn">
                <FaUser style={{ marginRight: "6px" }} /> Logout
              </button>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="log-btn">
                <FaUser style={{ marginRight: "6px" }} /> Login
              </button>
            )}
          </li>
        </ul>
      </nav>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </header>
  );
}

export default Header;
