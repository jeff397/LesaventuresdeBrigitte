import { useEffect, useState } from "react";
import { getComments, approveComment, deleteComment } from "../../api";
import "./adminComments.css"; // ✅ ajout du CSS

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments();
        setComments(data);
      } catch (err) {
        console.error("Erreur chargement commentaires :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleApprove = async (id) => {
    await approveComment(id);
    setComments(
      comments.map((c) => (c._id === id ? { ...c, approved: true } : c))
    );
  };

  const handleDelete = async (id) => {
    await deleteComment(id);
    setComments(comments.filter((c) => c._id !== id));
  };

  if (loading) return <p>Chargement des commentaires...</p>;

  return (
    <div className="admin-comments">
      <h2>Gestion des commentaires</h2>
      {comments.length === 0 ? (
        <p>Aucun commentaire pour le moment.</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} className="comment-card">
            <p>
              <strong>{c.name}</strong>: {c.content}
            </p>
            <div className="comment-actions">
              {!c.approved && (
                <button onClick={() => handleApprove(c._id)}>Valider</button>
              )}
              <button onClick={() => handleDelete(c._id)}>Supprimer</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminComments;
