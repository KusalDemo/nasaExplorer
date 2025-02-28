import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://127.0.0.1:3000/api';

class ApiClient {
    private static instance: AxiosInstance | null = null;

    private constructor() {}

    private static async getAccessToken(): Promise<string | null> {
        return await AsyncStorage.getItem('access_token');
    }

    public static async getAxiosInstance(): Promise<AxiosInstance> {
        if (!this.instance) {
            const accessToken = await this.getAccessToken();

            this.instance = axios.create({
                baseURL: BASE_URL,
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            });

            this.instance.interceptors.response.use(
                (response: AxiosResponse) => response,
                async (error: AxiosError) => {
                    if (error.response?.status === 401) {
                        console.error("Session expired. Please log in again.");
                        await AsyncStorage.removeItem('access_token');
                    }
                    return Promise.reject(error);
                }
            );
        }
        return this.instance;
    }

    public static async setAccessToken(token: string): Promise<void> {
        await AsyncStorage.setItem('access_token', token);
        this.instance = axios.create({
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    public static async clearAccessToken(): Promise<void> {
        await AsyncStorage.removeItem('access_token');
        this.instance = null; // Reset instance when access token is cleared
    }
}

export default ApiClient