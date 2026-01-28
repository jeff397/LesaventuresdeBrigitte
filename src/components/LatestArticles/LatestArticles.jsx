import { Link } from "react-router-dom";
import { decodeHTML } from "../../utils/decodeHtml";
import "./latestArticles.css";

function LatestArticles({ articles }) {
  if (!articles || articles.length === 0) return <p>Aucun article récent.</p>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className="latest-articles">
      <h2>Articles récents</h2>
      <div className="latest-articles-grid">
        {articles.map((article) => (
          <div key={article._id} className="blog-article-card">
            {article.images?.[0]?.url && (
              <div className="image-wrapper">
                <img src={article.images[0].url} alt={article.title} />

                {article.createdAt && (
                  <span className="published-badge">
                    Publié le {formatDate(article.createdAt)}
                  </span>
                )}
              </div>
            )}

            <div className="article-content">
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">
                {decodeHTML(article.content.replace(/<[^>]+>/g, "")).substring(
                  0,
                  150,
                )}
                ...
              </p>
              <Link to={`/article/${article.slug}`} className="read-more">
                Lire la suite
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LatestArticles;
