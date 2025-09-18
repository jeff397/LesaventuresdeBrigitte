import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { slugify } from "../../utils/slugify"; // transforme "D'hier et d'aujourd'hui" → "dhier-et-daujourdhui"
import "./header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const blogs = [
    "Villers-sur-Authie",
    "D'hier et d'aujourd'hui",
    "Somme-photos",
  ];

  return (
    <header>
      <nav>
        <h1>Les aventures de Brigitte</h1>
        <ul>
          <li>
            <Link to="/">Accueil</Link>
          </li>

          {blogs.map((blog) => (
            <li key={blog}>
              <Link to={`/blog/${slugify(blog)}`}>{blog}</Link>
            </li>
          ))}

          <li>
            {isLoggedIn ? (
              <Link to="/login" onClick={handleLogout}>
                <FaUser style={{ marginRight: "6px" }} /> Logout
              </Link>
            ) : (
              <Link to="/login">
                <FaUser style={{ marginRight: "6px" }} /> Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
