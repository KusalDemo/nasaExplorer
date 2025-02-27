import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getNearEarthObjects } from '../../utils/api';
import { NearEarthObject } from '../../types/api';

interface AsteroidsState {
    asteroids: NearEarthObject[];
    selectedAsteroid: NearEarthObject | null;
    loading: boolean;
    error: string | null;
}

const initialState: AsteroidsState = {
    asteroids: [],
    selectedAsteroid: null,
    loading: false,
    error: null,
};

export const fetchAsteroids = createAsyncThunk(
    'asteroids/fetchAsteroids',
    async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
        return await getNearEarthObjects(startDate, endDate);
    }
);

const asteroidsSlice = createSlice({
    name: 'asteroids',
    initialState,
    reducers: {
        setSelectedAsteroid: (state, action: PayloadAction<NearEarthObject>) => {
            state.selectedAsteroid = action.payload;
        },
        clearAsteroidError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsteroids.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAsteroids.fulfilled, (state, action: PayloadAction<NearEarthObject[]>) => {
                state.loading = false;
                state.asteroids = action.payload;
            })
            .addCase(fetchAsteroids.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch asteroids';
            });
    },
});

export const { setSelectedAsteroid, clearAsteroidError } = asteroidsSlice.actions;
export default asteroidsSlice.reducer;