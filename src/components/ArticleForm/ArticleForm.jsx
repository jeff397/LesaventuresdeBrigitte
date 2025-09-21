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
  const [content, setContent] = useState("");
  const [blog, setBlog] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

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
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const data = await getArticleById(articleId);
        setTitle(data.title);
        setSubtitle(data.subtitle || "");
        setContent(data.content);
        setCategory(data.category?._id || "");
        setBlog(data.blog || "");
        if (data.images?.length > 0) {
          setExistingImages(data.images);
          setImagePreviews(data.images.map((img) => img.url));
        }
      } catch (err) {
        console.error("Erreur chargement article", err);
      }
    };
    fetchArticle();
  }, [articleId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = async (index, existing = false) => {
    if (existing) {
      const img = existingImages[index];
      try {
        await deleteImage(articleId, img.public_id);
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      } catch (err) {
        console.error("Erreur suppression image existante", err);
        alert("Impossible de supprimer l'image (voir console)");
      }
    } else {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    if (
      categories.some((cat) => cat.title.toLowerCase() === name.toLowerCase())
    ) {
      alert("Cette catégorie existe déjà");
      return;
    }

    try {
      const res = await API.post("/categories", { name });
      const newCat = res.data;
      setCategories([...categories, newCat]);
      setCategory(newCat._id);
      setNewCategoryName("");
    } catch (err) {
      console.error("Erreur création catégorie", err);
      alert("Impossible de créer la catégorie (voir console).");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Veuillez entrer un titre";
    if (!content || content.trim() === "" || content === "<p></p>")
      newErrors.content = "Veuillez saisir du contenu";
    if (!category) newErrors.category = "Veuillez sélectionner une catégorie";
    if (!blog) newErrors.blog = "Veuillez sélectionner un blog";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    let imagesArray = [...existingImages];

    if (imageFiles.length > 0) {
      try {
        const uploadedImages = await Promise.all(imageFiles.map(uploadImage));
        imagesArray = [
          ...imagesArray,
          ...uploadedImages.map((img) => ({
            url: img.url,
            public_id: img.public_id,
          })),
        ];
      } catch (err) {
        console.error("Image upload failed", err);
        return;
      }
    }

    const formData = {
      title,
      subtitle,
      content,
      category,
      blog,
      images: imagesArray,
    };

    try {
      if (articleId) {
        await updateArticle(articleId, formData);
      } else {
        await createArticle(formData);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de l'article", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      if (category === id) setCategory("");
    } catch (err) {
      console.error("Erreur suppression catégorie :", err);
      alert("Impossible de supprimer la catégorie (voir console)");
    }
  };

  const confirmDeleteCategory = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  return (
    <>
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Voulez-vous vraiment supprimer cette catégorie ?</p>
            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  handleDeleteCategory(categoryToDelete);
                  setShowDeleteModal(false);
                }}
              >
                Oui, supprimer
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="article-form">
        <h2>{articleId ? "Modifier l'article" : "Créer un nouvel article"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Titre :</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "input-error" : ""}
            />
            {errors.title && <p className="error">{errors.title}</p>}
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
            <label>Images :</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <div className="image-preview-container">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`Aperçu ${index}`} />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(index, index < existingImages.length)
                    }
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label>Contenu :</label>
            <Editor
              key={articleId || "new"}
              value={content}
              onEditorChange={setContent}
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
              className={errors.content ? "input-error" : ""}
            />
            {errors.content && <p className="error">{errors.content}</p>}
          </div>

          <div>
            <label>Catégorie :</label>
            <div className="category-select-wrapper">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={errors.category ? "input-error" : ""}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              {category && (
                <button
                  type="button"
                  className="delete-category-btn"
                  onClick={() => confirmDeleteCategory(category)}
                >
                  Supprimer
                </button>
              )}
            </div>
            {errors.category && <p className="error">{errors.category}</p>}
          </div>

          <div className="new-category-container">
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

          <div>
            <label>Blog :</label>
            <select
              value={blog}
              onChange={(e) => setBlog(e.target.value)}
              className={errors.blog ? "input-error" : ""}
            >
              <option value="">Sélectionnez un blog</option>
              <option value="Villers-sur-Authie">Villers-sur-Authie</option>
              <option value="D'hier et d'aujourd'hui">
                D'hier et d'aujourd'hui
              </option>
              <option value="Somme-photos">Somme-photos</option>
            </select>
            {errors.blog && <p className="error">{errors.blog}</p>}
          </div>

          <button type="submit">{articleId ? "Modifier" : "Créer"}</button>
        </form>
      </section>
    </>
  );
}

export default ArticleForm;
