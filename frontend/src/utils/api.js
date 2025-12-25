import axios from "axios";

// Backend API base URL — make sure it matches your backend port
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach token with every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized (401) errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// --- Category APIs ---
export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};

// --- Bookmark APIs ---
export const addBookmark = async (data) => {
  const res = await API.post("/bookmarks", data);
  return res.data;
};

export const getBookmarks = async () => {
  const res = await API.get("/bookmarks");
  return res.data;
};

export default API;
