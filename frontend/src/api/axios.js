
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
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

export default API;

// import API from "../api/axios";

// const getProfile = async () => {

//   const res = await API.get(
//     "/user/profile"
//   );

//   console.log(res.data);
// };