import axios from 'axios';
import {APOD, EarthImage, MarsRoverPhoto, NearEarthObject, RoverManifest} from "../types/api";


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

export const getAPODRange = async (start_date: string, end_date: string): Promise<APOD[]> => {
    const response = await api.get('/planetary/apod', {
        params: { start_date, end_date },
    });
    return response.data;
};

export const getMarsRoverPhotos = async (
    rover: string = 'curiosity',
    sol: number = 1000,
    camera?: string
): Promise<MarsRoverPhoto[]> => {
    const response = await api.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
        params: { sol, camera },
    });
    return response.data.photos;
};

export const getRoverManifest = async (rover: string): Promise<RoverManifest> => {
    const response = await api.get(`/mars-photos/api/v1/manifests/${rover}`);
    return response.data.photo_manifest;
};

export const getNearEarthObjects = async (
    startDate: string,
    endDate: string
): Promise<NearEarthObject[]> => {
    const response = await api.get('/neo/rest/v1/feed', {
        params: { start_date: startDate, end_date: endDate },
    });
    return Object.values(response.data.near_earth_objects).flat();
};

export const getEarthImagery = async (
    lat: number,
    lon: number,
    date: string
): Promise<EarthImage> => {
    const response = await api.get('/planetary/earth/assets', {
        params: { lat, lon, date },
    });
    return response.data;
};