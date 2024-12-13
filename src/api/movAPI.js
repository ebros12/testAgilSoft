import axios from 'axios';

const movAPI = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL + '/movies'
});

movAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`  // Se agrega el prefijo 'Bearer'
    };
  }

  return config;
}, error => {
  return Promise.reject(error);
});

export default movAPI;
