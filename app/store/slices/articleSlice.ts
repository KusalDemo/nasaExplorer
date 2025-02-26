import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Article {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    likes: number;
    dislikes: number;
    userLiked?: boolean;
    userDisliked?: boolean;
}

interface ArticleState {
    articles: Article[];
    userArticles: Article[];
    currentArticle: Article | null;
    loading: boolean;
    error: string | null;
}

const initialState: ArticleState = {
    articles: [],
    userArticles: [],
    currentArticle: null,
    loading: false,
    error: null,
};

const articleSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        setArticles: (state, action: PayloadAction<Article[]>) => {
            state.articles = action.payload;
            state.loading = false;
            state.error = null;
        },
        setUserArticles: (state, action: PayloadAction<Article[]>) => {
            state.userArticles = action.payload;
        },
        setCurrentArticle: (state, action: PayloadAction<Article>) => {
            state.currentArticle = action.payload;
        },
        addArticle: (state, action: PayloadAction<Article>) => {
            state.articles.unshift(action.payload);
            state.userArticles.unshift(action.payload);
        },
        updateArticle: (state, action: PayloadAction<Article>) => {
            const index = state.articles.findIndex(a => a.id === action.payload.id);
            if (index !== -1) {
                state.articles[index] = action.payload;
            }
            const userIndex = state.userArticles.findIndex(a => a.id === action.payload.id);
            if (userIndex !== -1) {
                state.userArticles[userIndex] = action.payload;
            }
            if (state.currentArticle?.id === action.payload.id) {
                state.currentArticle = action.payload;
            }
        },
        deleteArticle: (state, action: PayloadAction<string>) => {
            state.articles = state.articles.filter(a => a.id !== action.payload);
            state.userArticles = state.userArticles.filter(a => a.id !== action.payload);
            if (state.currentArticle?.id === action.payload) {
                state.currentArticle = null;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setArticles,
    setUserArticles,
    setCurrentArticle,
    addArticle,
    updateArticle,
    deleteArticle,
    setLoading,
    setError,
} = articleSlice.actions;

export default articleSlice.reducer;