import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    articles: string[];
    comments: string[];
}

interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

interface UserState {
    currentUser: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: UserState = {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
};

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/user/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/user/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
        updateProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.currentUser) {
                state.currentUser = { ...state.currentUser, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, updateProfile } = userSlice.actions;

export default userSlice.reducer;