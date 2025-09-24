import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/categories`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
