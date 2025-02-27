import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAPOD, getAPODRange } from '../../utils/api';
import { APOD } from '../../types/api';

interface ApodState {
    currentApod: APOD | null;
    apodCollection: APOD[];
    loading: boolean;
    error: string | null;
}

const initialState: ApodState = {
    currentApod: null,
    apodCollection: [],
    loading: false,
    error: null,
};

export const fetchApod = createAsyncThunk(
    'apod/fetchApod',
    async (date?: string) => {
        return await getAPOD(date);
    }
);

export const fetchApodRange = createAsyncThunk(
    'apod/fetchApodRange',
    async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
        return await getAPODRange(startDate, endDate);
    }
);

const apodSlice = createSlice({
    name: 'apod',
    initialState,
    reducers: {
        clearApodError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Single APOD fetch
            .addCase(fetchApod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApod.fulfilled, (state, action: PayloadAction<APOD>) => {
                state.loading = false;
                state.currentApod = action.payload;
            })
            .addCase(fetchApod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch APOD';
            })
            // APOD range fetch
            .addCase(fetchApodRange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApodRange.fulfilled, (state, action: PayloadAction<APOD[]>) => {
                state.loading = false;
                state.apodCollection = action.payload;
            })
            .addCase(fetchApodRange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch APOD range';
            });
    },
});

export const { clearApodError } = apodSlice.actions;
export default apodSlice.reducer;