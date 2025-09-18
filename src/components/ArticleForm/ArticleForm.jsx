import { useState, useEffect } from "react";
import {
  createArticle,
  updateArticle,
  getArticleById,
} from "../../services/articles";
import API, { uploadImage, deleteImage } from "../../api";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import "./articleForm.css";

import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/skins/ui/oxide/skin.min.css";

import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";

function ArticleForm({ articleId }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // --- Gestion catégories ---
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // --- Gestion blog ---
  const [blog, setBlog] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur chargement catégories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (articleId) {
      const fetchArticle = async () => {
        const data = await getArticleById(articleId);
        setTitle(data.title);
        setSubtitle(data.subtitle || "");
        setContent(data.content);
        setCategory(data.category?._id || "");
        setBlog(data.blog || "");
        if (data.images?.length > 0) {
          setImagePreview(data.images[0].url);
          setImagePublicId(data.images[0].public_id);
        }
      };
      fetchArticle();
    }
  }, [articleId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = async () => {
    if (articleId && imagePublicId) {
      try {
        await deleteImage(articleId, imagePublicId);
      } catch (err) {
        console.error("Erreur suppression image", err);
        alert("Impossible de supprimer l'image (voir console).");
        return;
      }
    }
    setImageFile(null);
    setImagePreview(null);
    setImagePublicId(null);
  };
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await API.post("/categories", { name: newCategoryName });
      const newCat = res.data;
      setCategories([...categories, newCat]);
      setCategory(newCat._id);
      setNewCategoryName("");
    } catch (err) {
      console.error("Erreur création catégorie", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      alert("Veuillez sélectionner une catégorie");
      return;
    }
    if (!blog) {
      alert("Veuillez sélectionner un blog");
      return;
    }

    const formData = { title, subtitle, content, category, blog };

    // ⚡ Gestion image
    if (imageFile) {
      try {
        // Supprimer l’ancienne image si elle existe
        if (articleId && imagePublicId) {
          await API.delete(`/articles/${articleId}/images/${imagePublicId}`);
        }
        const uploaded = await uploadImage(imageFile);
        formData.images = [
          { url: uploaded.url, public_id: uploaded.public_id },
        ];
      } catch (err) {
        console.error("Image upload failed", err);
        return;
      }
    } else if (!imagePreview) {
      formData.images = [];
    }

    try {
      if (articleId) await updateArticle(articleId, formData);
      else await createArticle(formData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de l'article", err);
    }
  };

  return (
    <section className="article-form">
      <h1>{articleId ? "Modifier l'article" : "Créer un nouvel article"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre :</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Sous-titre :</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        <div>
          <label>Image principale :</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Aperçu" />
              <button type="button" onClick={handleRemoveImage}>
                Supprimer
              </button>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div>
          <label>Contenu :</label>
          <Editor
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: 400,
              menubar: true,
              base_url: "/tinymce",
              plugins: [
                "advlist autolink lists link image charmap preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | forecolor backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | link image | removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </div>

        {/* Catégorie */}
        <div>
          <label>Catégorie :</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Nouvelle catégorie */}
        <div>
          <label>Nouvelle catégorie :</label>
          <input
            type="text"
            placeholder="Créer une nouvelle catégorie"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button type="button" onClick={handleCreateCategory}>
            Ajouter
          </button>
        </div>

        {/* Blog */}
        <div>
          <label>Blog :</label>
          <select
            value={blog}
            onChange={(e) => setBlog(e.target.value)}
            required
          >
            <option value="">Sélectionnez un blog</option>
            <option value="Villers-sur-Authie">Villers-sur-Authie</option>
            <option value="D'hier et d'aujourd'hui">
              D'hier et d'aujourd'hui
            </option>
            <option value="Somme-photos">Somme-photos</option>
          </select>
        </div>

        <button type="submit">{articleId ? "Modifier" : "Créer"}</button>
      </form>
    </section>
  );
}

export default ArticleForm;
