// src/axios.js
import axios from "axios";

// Use dynamic backend URL from env
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", // Default to local if not set
  withCredentials: true, // optional: if you use cookies / auth
});

export default instance;
