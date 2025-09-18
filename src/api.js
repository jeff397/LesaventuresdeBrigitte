import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Fonction pour uploader une image
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // <-- "file" doit correspondre à req.files.file côté serveur

    const { data } = await API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data; // { url: "https://..." }
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err;
  }
};

// Fonction pour supprimer une image d'un article
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

export default API;
