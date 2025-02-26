import axios from 'axios';
import {APOD} from "../types/api";


const NASA_API_KEY = '4pxrCp6RAQdSObS5alMeMY8ZQy6KecFpSOTPXArK';
const BASE_URL = 'https://api.nasa.gov';

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: NASA_API_KEY,
    },
});

export const getAPOD = async (date?: string): Promise<APOD> => {
    const response = await api.get('/planetary/apod', {
        params: { date },
    });
    return response.data;
};