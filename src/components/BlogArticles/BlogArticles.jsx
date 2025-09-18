// src/components/BlogArticles.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";

function BlogArticles() {
  const { blogName } = useParams(); // slug de l'URL, ex: "dhier-et-daujourdhui"
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!blogName) return;

    const fetchArticles = async () => {
      try {
        // On envoie blogSlug au backend
        const res = await API.get(
          `/articles?blogSlug=${encodeURIComponent(blogName)}`
        );
        setArticles(res.data);
      } catch (err) {
        console.error("Erreur chargement articles", err);
      }
    };

    fetchArticles();
  }, [blogName]);

  if (!blogName) return <p>Aucun blog sélectionné.</p>;

  return (
    <section className="blog-articles">
      <h1>Articles du blog : {blogName.replace(/-/g, " ")}</h1>
      {articles.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article._id}>
              <h2>{article.title}</h2>
              {article.images?.length > 0 && (
                <img src={article.images[0].url} alt={article.title} />
              )}
              <p
                dangerouslySetInnerHTML={{
                  __html: article.content.substring(0, 200) + "...",
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default BlogArticles;
