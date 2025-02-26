import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import articleReducer from './slices/articleSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        articles: articleReducer,
        comments: commentReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;