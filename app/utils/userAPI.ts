import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/user';

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const register = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateUser = async (email: string, userData: { name?: string; password?: string }) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/update/${email}`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};