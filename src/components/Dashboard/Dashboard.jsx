import { useState, useEffect } from "react";
import { getArticles, deleteArticle } from "../../services/articles";
import { Link } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getArticles();
      setArticles(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((article) => article._id !== id));
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <Link to="/dashboard/new" className="new-article-btn">
        Créer un nouvel article
      </Link>

      {articles.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        <ul className="articles-list">
          {articles.map((article) => (
            <li key={article._id} className="article-item">
              <Link
                to={`/dashboard/edit/${article._id}`}
                className="article-title"
              >
                {article.title}
              </Link>
              <button
                className="delete-btn"
                onClick={() => handleDelete(article._id)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
