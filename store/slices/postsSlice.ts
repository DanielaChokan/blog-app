import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api-client";
import {
    Comment,
    CreateCommentDto,
    CreatePostDto,
    Post,
    PostWithComments,
    UpdatePostDto,
} from "@/types/blog";

type PostsState = {
    posts: Post[];
    selectedPost: PostWithComments | null;
    loading: boolean;
    error: string | null;
    filter: string;
};

const initialState: PostsState = {
    posts: [],
    selectedPost: null,
    loading: false,
    error: null,
    filter: "",
};

export const fetchPostsThunk = createAsyncThunk("posts/fetchAll", async () => {
    return apiClient.getPosts() as Promise<Post[]>;
});

export const createPostThunk = createAsyncThunk(
    "posts/create",
    async (payload: CreatePostDto) =>
        apiClient.createPost(payload) as Promise<Post>,
);

export const fetchPostByIdThunk = createAsyncThunk(
    "posts/fetchById",
    async (id: string) =>
        apiClient.getPostById(id) as Promise<PostWithComments>,
);

export const updatePostThunk = createAsyncThunk(
    "posts/update",
    async ({ id, data }: { id: string; data: UpdatePostDto }) =>
        apiClient.updatePost(id, data) as Promise<Post>,
);

export const deletePostThunk = createAsyncThunk(
    "posts/delete",
    async ({ id, expectedVersion }: { id: string; expectedVersion: number }) => {
        await apiClient.deletePost(id, expectedVersion);
        return id;
    },
);

export const addCommentThunk = createAsyncThunk(
    "posts/addComment",
    async ({ postId, data }: { postId: string; data: CreateCommentDto }) =>
        apiClient.addComment(postId, data) as Promise<Comment>,
);

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<string>) {
            state.filter = action.payload;
        },
        hydratePosts(state, action: PayloadAction<Post[]>) {
            state.posts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPostsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch posts";
            })
            .addCase(createPostThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(createPostThunk.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })
            .addCase(createPostThunk.rejected, (state, action) => {
                state.error = action.error.message || "Failed to create post";
            })
            .addCase(fetchPostByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPost = action.payload;
            })
            .addCase(fetchPostByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch post";
            })
            .addCase(updatePostThunk.fulfilled, (state, action) => {
                state.posts = state.posts.map((p) =>
                    p.id === action.payload.id ? action.payload : p,
                );
                if (state.selectedPost?.id === action.payload.id) {
                    state.selectedPost = {
                        ...state.selectedPost,
                        ...action.payload,
                    };
                }
            })
            .addCase(updatePostThunk.rejected, (state, action) => {
                state.error = action.error.message || "Failed to update post";
            })
            .addCase(deletePostThunk.fulfilled, (state, action) => {
                state.posts = state.posts.filter(
                    (p) => p.id !== action.payload,
                );
                if (state.selectedPost?.id === action.payload) {
                    state.selectedPost = null;
                }
            })
            .addCase(deletePostThunk.rejected, (state, action) => {
                state.error = action.error.message || "Failed to delete post";
            })
            .addCase(addCommentThunk.fulfilled, (state, action) => {
                if (state.selectedPost) {
                    const comments = state.selectedPost.comments ?? [];
                    state.selectedPost.comments = [...comments, action.payload];
                }
            })
            .addCase(addCommentThunk.rejected, (state, action) => {
                state.error = action.error.message || "Failed to add comment";
            });
    },
});

export const { setFilter, hydratePosts } = postsSlice.actions;
export default postsSlice.reducer;
