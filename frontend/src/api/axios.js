
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/public/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const nextToken = refreshResponse.data.accessToken || refreshResponse.data.token;

      if (nextToken) {
        localStorage.setItem("token", nextToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      }

      return API(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("token");
      return Promise.reject(refreshError);
    }
  }
);

export default API;

// import API from "../api/axios";

// const getProfile = async () => {

//   const res = await API.get(
//     "/user/profile"
//   );

//   console.log(res.data);
// };