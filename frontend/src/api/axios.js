import axios from "axios";

const API = axios.create({
  baseURL: "https://job-portal-backend-15s4.onrender.com/api/auth",
});

export default API;