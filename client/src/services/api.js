import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-ecommerce-store-t8vf.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;