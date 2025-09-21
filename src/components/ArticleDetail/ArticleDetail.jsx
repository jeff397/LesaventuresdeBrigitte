import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import ArticleComments from "../ArticleComments/ArticleComments";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
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

  return (
    <article className="article-detail">
      <h1>{article.title}</h1>

      <p className="article-meta">
        Publié{" "}
        {formatDistanceToNow(new Date(article.createdAt), {
          addSuffix: true,
          locale: fr,
        })}
      </p>

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
