import axios from "axios";

const baseURL = "http://localhost:8000/api"; // Your API base URL

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    // Add any common headers here
  },
});

export default api;
