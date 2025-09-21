import { useState, useContext } from "react";
import { login as loginAPI } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./loginForm.css";

function LoginForm({ onSuccess }) {
  // <-- ajouter prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginAPI({ email, password });
      login(data.token);

      // Fermer la modale si un callback est passé
      if (onSuccess) onSuccess();

      navigate("/dashboard"); // Tu peux conserver ou supprimer selon le besoin
    } catch (err) {
      setError(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <section className="login-form">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Se connecter</button>
      </form>
    </section>
  );
}

export default LoginForm;
