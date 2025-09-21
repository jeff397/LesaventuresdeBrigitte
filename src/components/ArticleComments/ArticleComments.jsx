import { useState, useEffect } from "react";
import API from "../../api";
import "./articleComments.css";

function ArticleComments({ articleId, existingComments }) {
  const [comments, setComments] = useState(existingComments || []);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments?article=${articleId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Erreur chargement commentaires :", err);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !content) return;

    try {
      const res = await API.post("/comments", {
        article: articleId,
        name,
        content,
        approved: false,
      });

      setComments((prev) => [...prev, res.data]);
      setName("");
      setContent("");
      setMessage("Votre commentaire sera publié après modération");
    } catch (err) {
      console.error("Erreur ajout commentaire :", err);
      setMessage("Impossible d'ajouter le commentaire");
    }
  };

  const approvedComments = comments.filter(
    (c) =>
      c.article &&
      String(c.article._id || c.article) === String(articleId) &&
      c.approved
  );

  const pendingComments = comments.filter(
    (c) =>
      c.article &&
      String(c.article._id || c.article) === String(articleId) &&
      !c.approved
  );

  return (
    <section className="comments-section">
      <h2>Commentaires</h2>

      {approvedComments.length === 0 && pendingComments.length === 0 && (
        <p>Aucun commentaire pour le moment</p>
      )}

      <ul className="comments-list">
        {approvedComments.map((c) => (
          <li key={c._id}>
            <strong>{c.name}</strong>
            <p>{c.content}</p>
          </li>
        ))}

        {pendingComments.map((c) => (
          <li key={c._id} className="pending-comment">
            <strong>{c.name}</strong>
            <p>{c.content}</p>
            <em>(En attente de modération)</em>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="comment-form">
        <h3>Laisser un commentaire</h3>
        <input
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Votre commentaire"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Envoyer</button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

export default ArticleComments;
