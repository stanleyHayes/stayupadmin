import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchPosts = createAsyncThunk("blog/fetchPosts", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/posts`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch posts");
    }
});

export const fetchPost = createAsyncThunk("blog/fetchPost", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/posts/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch post");
    }
});

export const createPost = createAsyncThunk("blog/createPost", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/posts`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create post");
    }
});

export const updatePost = createAsyncThunk("blog/updatePost", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/posts/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update post");
    }
});

export const deletePost = createAsyncThunk("blog/deletePost", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/posts/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete post");
    }
});

const blogSlice = createSlice({
    name: "blog",
    initialState: {
        posts: [],
        post: null,
        postLoading: false,
        postError: null
    },
    reducers: {
        clearPost(state) { state.post = null; },
        clearPostError(state) { state.postError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPosts.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(fetchPosts.fulfilled, (s, a) => {
                s.postLoading = false;
                if (Array.isArray(a.payload)) {
                    s.posts = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.posts = a.payload.data;
                } else {
                    s.posts = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchPosts.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; })

            .addCase(fetchPost.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(fetchPost.fulfilled, (s, a) => { s.postLoading = false; s.post = a.payload?.data ?? a.payload; })
            .addCase(fetchPost.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; })

            .addCase(createPost.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(createPost.fulfilled, (s, a) => {
                s.postLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.posts.unshift(created);
            })
            .addCase(createPost.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; })

            .addCase(updatePost.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(updatePost.fulfilled, (s, a) => {
                s.postLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.posts = s.posts.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.post && (s.post._id ?? s.post.id) === id) s.post = { ...s.post, ...updated };
                }
            })
            .addCase(updatePost.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; })

            .addCase(deletePost.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(deletePost.fulfilled, (s, a) => {
                s.postLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.posts = s.posts.filter(x => (x._id ?? x.id) !== id);
                    if (s.post && (s.post._id ?? s.post.id) === id) s.post = null;
                }
            })
            .addCase(deletePost.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; });
    }
});

export const { clearPost, clearPostError } = blogSlice.actions;
export const selectBlog = state => state.blog;
export default blogSlice.reducer;
