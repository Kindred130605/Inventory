import axios from "axios";

// axios.defaults.baseURL = "http://127.0.0.1:8000/api/";

//const API_URL = "http://127.0.0.1:8000/api/";
const API_URL = "http://192.168.1.29:8000/api/";

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ${token}';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to fetch current user's data
export async function fetchCurrentUser() {
  try {
    const response = await api.get('/user', {
    });
    console.log('API call response:', response); // Log the entire response object
    return response.data;
  } catch (error) {
    console.error('Error in API call:', error); // Log the error object
    throw new Error('Failed to fetch current user');
  }
}

export default api;