import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import ArticleComments from "../ArticleComments/ArticleComments";
import "./articleDetail.css";

function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        const res = await API.get(`/articles/slug/${slug}`);
        setArticle(res.data);

        const commentsRes = await API.get(`/comments?article=${res.data._id}`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Erreur chargement article :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Article non trouvé</p>;

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <article className="article-detail">
      <h1>{article.title}</h1>

      {article.createdAt && (
        <p className="article-meta">
          Publié le {formatDate(article.createdAt)}
        </p>
      )}

      {article.images?.length > 0 && (
        <div className="article-images">
          {article.images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={article.title}
              className="article-detail-image"
            />
          ))}
        </div>
      )}

      <div
        className="article-detail-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <ArticleComments articleId={article._id} existingComments={comments} />
    </article>
  );
}

export default ArticleDetail;
