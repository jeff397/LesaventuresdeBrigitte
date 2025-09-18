// services/auth.js
import API from "../api";

export const login = async ({ email, password }) => {
  const { data } = await API.post("/auth/login", { email, password });

  localStorage.setItem("token", data.token);

  return data;
};
