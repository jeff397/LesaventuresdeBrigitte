import API from "../api";

// Récupérer tous les articles
export const getArticles = async () => {
  const { data } = await API.get("/articles");
  return data;
};

// Récupérer un article par ID
export const getArticleById = async (id) => {
  const { data } = await API.get(`/articles/${id}`);
  return data;
};

// Créer un nouvel article
export const createArticle = async (article) => {
  const { data } = await API.post("/articles", article);
  return data;
};

// Mettre à jour un article
export const updateArticle = async (id, article) => {
  const { data } = await API.put(`/articles/${id}`, article);
  return data;
};

// Supprimer un article
export const deleteArticle = async (id) => {
  const { data } = await API.delete(`/articles/${id}`);
  return data;
};
