import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getMarsRoverPhotos, getRoverManifest } from '../../utils/api';
import { MarsRoverPhoto, RoverManifest } from '../../types/api';

interface MarsState {
    roverManifests: Record<string, RoverManifest>;
    roverPhotos: Record<string, MarsRoverPhoto[]>;
    selectedPhoto: MarsRoverPhoto | null;
    loading: boolean;
    error: string | null;
}

const initialState: MarsState = {
    roverManifests: {},
    roverPhotos: {},
    selectedPhoto: null,
    loading: false,
    error: null,
};

export const fetchRoverManifest = createAsyncThunk(
    'mars/fetchRoverManifest',
    async (roverName: string) => {
        return await getRoverManifest(roverName);
    }
);

export const fetchRoverPhotos = createAsyncThunk(
    'mars/fetchRoverPhotos',
    async ({
               rover,
               sol,
               camera
           }: {
        rover: string;
        sol: number;
        camera?: string
    }) => {
        const photos = await getMarsRoverPhotos(rover, sol, camera);
        return { rover, photos };
    }
);

const marsSlice = createSlice({
    name: 'mars',
    initialState,
    reducers: {
        setSelectedPhoto: (state, action: PayloadAction<MarsRoverPhoto>) => {
            state.selectedPhoto = action.payload;
        },
        clearMarsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Rover manifest
            .addCase(fetchRoverManifest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoverManifest.fulfilled, (state, action: PayloadAction<RoverManifest>) => {
                state.loading = false;
                state.roverManifests[action.payload.name.toLowerCase()] = action.payload;
            })
            .addCase(fetchRoverManifest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch rover manifest';
            })
            // Rover photos
            .addCase(fetchRoverPhotos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoverPhotos.fulfilled, (state, action) => {
                state.loading = false;
                state.roverPhotos[action.payload.rover] = action.payload.photos;
            })
            .addCase(fetchRoverPhotos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch rover photos';
            });
    },
});

export const { setSelectedPhoto, clearMarsError } = marsSlice.actions;
export default marsSlice.reducer;