import axios from "axios";

const API_URL = "http://26.11.249.89:8000/api";

const auth = axios.create({
    baseURL: API_URL
});

auth.interceptors.request.use(
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
    const response = await auth.get('/user', {
    });
    console.log('API call response:', response); 
    return response.data;
  } catch (error) {
    console.error('Error in API call:', error);
    throw new Error('Failed to fetch current user');
  }
}

export default auth;