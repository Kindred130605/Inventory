import axios from "axios";

const baseURL = "http://26.81.173.255:8000/api/inventory"; // Your API base URL

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",

  },
});

export default api;