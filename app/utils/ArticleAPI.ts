import axios from 'axios';
import ApiClient from "./ApiClient";
import { Article } from '../types/api';

const BASE_URL = 'http://127.0.0.1:3000/api/articles';

export const fetchAllArticles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/get-all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        throw new Error(error.message);
    }
};

export const fetchArticleById = async (articleId: string) => {
    try {
        const axiosInstance = await ApiClient.getAxiosInstance();
        const response = await axiosInstance.get(`${BASE_URL}/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching article:', error.message);
        throw new Error(error.message);
    }
};

export const addArticle = async (articleData: Omit<Article, '_id'>) => {
    try {
        const axiosInstance = await ApiClient.getAxiosInstance();
        const response = await axiosInstance.post(`${BASE_URL}/add`, articleData);
        return response.data;
    } catch (error) {
        console.error('Error adding article:', error.message);
        throw new Error(error.message);
    }
};

export const updateArticle = async (articleId: string, articleData: Partial<Article>) => {
    try {
        const axiosInstance = await ApiClient.getAxiosInstance();
        const response = await axiosInstance.put(`${BASE_URL}/update/${articleId}`, articleData);
        return response.data;
    } catch (error) {
        console.error('Error updating article:', error.message);
        throw new Error(error.message);
    }
};

export const deleteArticle = async (articleId: string) => {
    try {
        const axiosInstance = await ApiClient.getAxiosInstance();
        const response = await axiosInstance.delete(`${BASE_URL}/delete/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting article:', error.message);
        throw new Error(error.message);
    }
};

export const likeArticle = async (articleId: string) => {
    try {
        const axiosInstance = await ApiClient.getAxiosInstance();
        const response = await axiosInstance.post(`${BASE_URL}/like/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error liking article:', error.message);
        throw new Error(error.message);
    }
};

export const dislikeArticle = async (articleId: string) => {
    try {
        const axiosInstance = await ApiClient.getAxiosInstance();
        const response = await axiosInstance.post(`${BASE_URL}/dislike/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error disliking article:', error.message);
        throw new Error(error.message);
    }
};