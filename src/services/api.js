import axios from "axios";

const API_URL = "http://21.86.173.255:8000/api/inventory";

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

// Function to fetch current user's datas
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