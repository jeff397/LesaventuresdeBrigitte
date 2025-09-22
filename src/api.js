import axios from "axios";
import { API_URL } from "./config";

const API = axios.create({
  baseURL: `${API_URL}/api`,
});

// Intercepteur pour le token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ------------------- Images -------------------

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err;
  }
};

export const deleteImage = async (articleId, publicId) => {
  try {
    const { data } = await API.delete(
      `/articles/${articleId}/images/${encodeURIComponent(publicId)}`
    );
    return data;
  } catch (err) {
    console.error("Image delete failed:", err);
    throw err;
  }
};

// ------------------- Articles -------------------

export const createArticle = async (article) => {
  const { data } = await API.post("/articles", article);
  return data;
};

export const updateArticle = async (id, article) => {
  const { data } = await API.put(`/articles/${id}`, article);
  return data;
};

export const deleteArticle = async (id) => {
  const { data } = await API.delete(`/articles/${id}`);
  return data;
};

export const getArticles = async (blogSlug) => {
  const { data } = await API.get("/articles", { params: { blogSlug } });
  return data;
};

export const getArticleBySlug = async (slug) => {
  const { data } = await API.get(`/articles/slug/${slug}`);
  return data;
};

// ------------------- Commentaires -------------------

export const getComments = async () => {
  const { data } = await API.get("/comments");
  return data;
};

export const approveComment = async (id) => {
  const { data } = await API.patch(`/comments/${id}/approve`);
  return data;
};

export const deleteComment = async (id) => {
  const { data } = await API.delete(`/comments/${id}`);
  return data;
};

export default API;
