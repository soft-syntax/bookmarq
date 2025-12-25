import API from "./api";

export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};
