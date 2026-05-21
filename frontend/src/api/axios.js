import axios from "axios"

const api = axios.create({ baseURL: "http://localhost:8000" });// URL backend

// TỰ động gắn token vào mỗi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Tự động logout khi token hết hạn
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
});

export default api;