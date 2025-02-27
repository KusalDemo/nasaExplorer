import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import articleReducer from './slices/articleSlice';
import commentReducer from './slices/commentSlice';
import apodReducer from './slices/apodSlice';
import asteroidsReducer from './slices/asteroidsSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        articles: articleReducer,
        comments: commentReducer,
        apod: apodReducer,
        asteroids: asteroidsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;