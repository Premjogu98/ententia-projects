import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/insights';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = async (email, password) => {
    const response = await api.post(`/login`, { email, password });
    return response.data.detail;
};

export const register = async (email, password) => {
    const response = await api.post(`/register`, { email, password });
    return response.data;
};

export const getMe = async () => {
    const response = await api.get(`/users/me`);
    return response.data.detail;
};

export const getInsights = async (filters = {}, page = 1, size = 10) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
    });
    params.append('page', page);
    params.append('size', size);

    const response = await api.get(`/?${params.toString()}`);
    return response.data.detail;
};

export const createInsight = async (data) => {
    const response = await api.post('/', data);
    return response.data.detail;
};

export const updateInsight = async (id, data) => {
    const response = await api.put(`/${id}`, data);
    return response.data.detail;
};

export const deleteInsight = async (id) => {
    try {
        await api.delete(`/${id}`);
    } catch (error) {
        throw error;
    }
};

export default api;
