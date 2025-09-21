import axios from "axios";

export const getCategories = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/categories");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
