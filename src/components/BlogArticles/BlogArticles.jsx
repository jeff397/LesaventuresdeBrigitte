import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import API from "../../api";
import Pagination from "../../components/Pagination/Pagination";
import "./blogArticles.css";

function BlogArticles() {
  const { blogName } = useParams();
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 9;

  useEffect(() => {
    if (!blogName) return;

    const fetchArticles = async () => {
      try {
        const res = await API.get(
          `/articles?blogSlug=${encodeURIComponent(blogName)}`
        );
        setArticles(res.data);
        setCurrentPage(1); // reset pagination quand on change de blog
      } catch (err) {
        console.error("Erreur chargement articles", err);
      }
    };

    fetchArticles();
  }, [blogName]);

  if (!blogName) return <p>Aucun blog sélectionné.</p>;

  // Calcul pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = articles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  return (
    <section className="blog-articles">
      <h1>Articles du blog : {blogName.replace(/-/g, " ")}</h1>

      {articles.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        <>
          <div className="articles-grid">
            {currentArticles.map((article) => (
              <div key={article._id} className="blog-article-card">
                {article.images?.[0]?.url && (
                  <div className="image-wrapper">
                    <img src={article.images[0].url} alt={article.title} />
                    <span className="published-badge">
                      Publié il y a{" "}
                      {formatDistanceToNow(new Date(article.createdAt), {
                        locale: fr,
                      })}
                    </span>
                  </div>
                )}
                <div className="article-content">
                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-excerpt">
                    {article.content.replace(/<[^>]+>/g, "").substring(0, 150)}
                    ...
                  </p>
                  <Link to={`/article/${article.slug}`} className="read-more">
                    Lire la suite
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}

export default BlogArticles;
