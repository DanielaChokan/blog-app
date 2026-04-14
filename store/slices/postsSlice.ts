import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api-client";
import { getClientErrorMessage } from "@/lib/client-error";
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

export const fetchPostsThunk = createAsyncThunk<
    Post[],
    void,
    { rejectValue: string }
>("posts/fetchAll", async (_, { rejectWithValue }) => {
    try {
        return (await apiClient.getPosts()) as Post[];
    } catch (error) {
        return rejectWithValue(getClientErrorMessage(error, "Failed to fetch posts"));
    }
});

export const createPostThunk = createAsyncThunk<
    Post,
    CreatePostDto,
    { rejectValue: string }
>(
    "posts/create",
    async (payload, { rejectWithValue }) => {
        try {
            return (await apiClient.createPost(payload)) as Post;
        } catch (error) {
            return rejectWithValue(
                getClientErrorMessage(error, "Failed to create post"),
            );
        }
    },
);

export const fetchPostByIdThunk = createAsyncThunk<
    PostWithComments,
    string,
    { rejectValue: string }
>(
    "posts/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            return (await apiClient.getPostById(id)) as PostWithComments;
        } catch (error) {
            return rejectWithValue(getClientErrorMessage(error, "Failed to fetch post"));
        }
    },
);

export const updatePostThunk = createAsyncThunk<
    Post,
    { id: string; data: UpdatePostDto },
    { rejectValue: string }
>(
    "posts/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return (await apiClient.updatePost(id, data)) as Post;
        } catch (error) {
            return rejectWithValue(getClientErrorMessage(error, "Failed to update post"));
        }
    },
);

export const deletePostThunk = createAsyncThunk<
    string,
    { id: string; expectedVersion: number },
    { rejectValue: string }
>(
    "posts/delete",
    async ({ id, expectedVersion }, { rejectWithValue }) => {
        try {
            await apiClient.deletePost(id, expectedVersion);
            return id;
        } catch (error) {
            return rejectWithValue(getClientErrorMessage(error, "Failed to delete post"));
        }
    },
);

export const addCommentThunk = createAsyncThunk<
    Comment,
    { postId: string; data: CreateCommentDto },
    { rejectValue: string }
>(
    "posts/addComment",
    async ({ postId, data }, { rejectWithValue }) => {
        try {
            return (await apiClient.addComment(postId, data)) as Comment;
        } catch (error) {
            return rejectWithValue(getClientErrorMessage(error, "Failed to add comment"));
        }
    },
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
                state.error = action.payload ?? action.error.message ?? "Failed to fetch posts";
            })
            .addCase(createPostThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(createPostThunk.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })
            .addCase(createPostThunk.rejected, (state, action) => {
                state.error = action.payload ?? action.error.message ?? "Failed to create post";
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
                state.error = action.payload ?? action.error.message ?? "Failed to fetch post";
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
                state.error = action.payload ?? action.error.message ?? "Failed to update post";
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
                state.error = action.payload ?? action.error.message ?? "Failed to delete post";
            })
            .addCase(addCommentThunk.fulfilled, (state, action) => {
                if (state.selectedPost) {
                    const comments = state.selectedPost.comments ?? [];
                    state.selectedPost.comments = [...comments, action.payload];
                }
            })
            .addCase(addCommentThunk.rejected, (state, action) => {
                state.error = action.payload ?? action.error.message ?? "Failed to add comment";
            });
    },
});

export const { setFilter, hydratePosts } = postsSlice.actions;
export default postsSlice.reducer;
