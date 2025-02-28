import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAllArticles as fetchAllArticlesApi,
    fetchArticleById as fetchArticleByIdApi,
    addArticle as addArticleApi,
    updateArticle as updateArticleApi,
    deleteArticle as deleteArticleApi,
    likeArticle as likeArticleApi,
    dislikeArticle as dislikeArticleApi,
} from '../../utils/ArticleAPI';
import { Article } from '../../types/api';

interface ArticleState {
    articles: Article[];
    currentArticle: Article | null;
    loading: boolean;
    error: string | null;
}

const initialState: ArticleState = {
    articles: [],
    currentArticle: null,
    loading: false,
    error: null,
};

// Fetch all articles
export const fetchArticles = createAsyncThunk(
    'articles/fetchArticles',
    async () => {
        console.log(`Hello..`)
        let articles = await fetchAllArticlesApi();
        return articles;
    }
);

// Fetch article by ID
export const fetchArticleById = createAsyncThunk(
    'articles/fetchArticleById',
    async (articleId: string, { rejectWithValue }) => {
        try {
            const article = await fetchArticleByIdApi(articleId);
            return article;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch article');
        }
    }
);

// Add a new article
export const addArticle = createAsyncThunk(
    'articles/addArticle',
    async (articleData: Omit<Article, '_id'>, { rejectWithValue }) => {
        try {
            const newArticle = await addArticleApi(articleData);
            return newArticle;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add article');
        }
    }
);

// Update an article
export const updateArticle = createAsyncThunk(
    'articles/updateArticle',
    async ({ articleId, articleData }: { articleId: string; articleData: Partial<Article> }, { rejectWithValue }) => {
        try {
            const updatedArticle = await updateArticleApi(articleId, articleData);
            return updatedArticle;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update article');
        }
    }
);

// Delete an article
export const deleteArticle = createAsyncThunk(
    'articles/deleteArticle',
    async (articleId: string, { rejectWithValue }) => {
        try {
            await deleteArticleApi(articleId);
            return articleId;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete article');
        }
    }
);

// Like an article
export const likeArticle = createAsyncThunk(
    'articles/likeArticle',
    async (articleId: string, { rejectWithValue }) => {
        try {
            const updatedArticle = await likeArticleApi(articleId);
            return updatedArticle;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to like article');
        }
    }
);

// Dislike an article
export const dislikeArticle = createAsyncThunk(
    'articles/dislikeArticle',
    async (articleId: string, { rejectWithValue }) => {
        try {
            const updatedArticle = await dislikeArticleApi(articleId);
            return updatedArticle;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to dislike article');
        }
    }
);



const articleSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Articles
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.articles = action.payload;
                state.loading = false;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Article by ID
            .addCase(fetchArticleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
                state.currentArticle = action.payload;
                state.loading = false;
            })
            .addCase(fetchArticleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add Article
            .addCase(addArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addArticle.fulfilled, (state, action: PayloadAction<Article>) => {
                state.articles.unshift(action.payload);
                state.loading = false;
            })
            .addCase(addArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Article
            .addCase(updateArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action: PayloadAction<Article>) => {
                const updatedArticle = action.payload;
                state.articles = state.articles.map((article) =>
                    article._id === updatedArticle._id ? updatedArticle : article
                );
                if (state.currentArticle?._id === updatedArticle._id) {
                    state.currentArticle = updatedArticle;
                }
                state.loading = false;
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete Article
            .addCase(deleteArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<string>) => {
                const deletedArticleId = action.payload;
                state.articles = state.articles.filter((article) => article._id !== deletedArticleId);
                if (state.currentArticle?._id === deletedArticleId) {
                    state.currentArticle = null;
                }
                state.loading = false;
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Like Article
            .addCase(likeArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(likeArticle.fulfilled, (state, action: PayloadAction<Article>) => {
                const updatedArticle = action.payload;
                state.articles = state.articles.map((article) =>
                    article._id === updatedArticle._id ? updatedArticle : article
                );
                if (state.currentArticle?._id === updatedArticle._id) {
                    state.currentArticle = updatedArticle;
                }
                state.loading = false;
            })
            .addCase(likeArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Dislike Article
            .addCase(dislikeArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dislikeArticle.fulfilled, (state, action: PayloadAction<Article>) => {
                const updatedArticle = action.payload;
                state.articles = state.articles.map((article) =>
                    article._id === updatedArticle._id ? updatedArticle : article
                );
                if (state.currentArticle?._id === updatedArticle._id) {
                    state.currentArticle = updatedArticle;
                }
                state.loading = false;
            })
            .addCase(dislikeArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = articleSlice.actions;

export default articleSlice.reducer;