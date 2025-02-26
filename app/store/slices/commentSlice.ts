import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Comment {
    id: string;
    articleId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
}

interface CommentState {
    comments: Record<string, Comment[]>; // articleId -> comments
    loading: boolean;
    error: string | null;
}

const initialState: CommentState = {
    comments: {},
    loading: false,
    error: null,
};

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setComments: (state, action: PayloadAction<{ articleId: string; comments: Comment[] }>) => {
            const { articleId, comments } = action.payload;
            state.comments[articleId] = comments;
            state.loading = false;
            state.error = null;
        },
        addComment: (state, action: PayloadAction<Comment>) => {
            const { articleId } = action.payload;
            if (!state.comments[articleId]) {
                state.comments[articleId] = [];
            }
            state.comments[articleId].push(action.payload);
        },
        deleteComment: (state, action: PayloadAction<{ articleId: string; commentId: string }>) => {
            const { articleId, commentId } = action.payload;
            if (state.comments[articleId]) {
                state.comments[articleId] = state.comments[articleId].filter(
                    c => c.id !== commentId
                );
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
    setComments,
    addComment,
    deleteComment,
    setLoading,
    setError,
} = commentSlice.actions;

export default commentSlice.reducer;