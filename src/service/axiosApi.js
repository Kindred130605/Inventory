import axios from "axios";

const baseURL = "http://192.168.1.29:8000/api/inventory"; // Your API base URL

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    // Add any common headers here
  },
});

export default api;
