import axios from 'axios';


const authAPI = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BASE_URL + '/auth'  // Nota el cambio aquí
});

authAPI.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }
    return config;
});

export default authAPI;
