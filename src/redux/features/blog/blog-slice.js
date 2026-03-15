import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { posts as seedPosts } from "./posts";

let _posts = [...seedPosts];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._posts];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(p =>
                (p.title || "").toLowerCase().includes(q) ||
                (p.tag || "").toLowerCase().includes(q) ||
                (p.author?.name || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(p => p.status === params.status);
        }
        if (params.tag && params.tag !== "all") {
            res = res.filter(p => p.tag === params.tag);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _posts.find(p => String(p._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `post${Date.now()}`;
        const now = new Date().toISOString();
        const newPost = { _id, status: "draft", featured: false, created_at: now, updated_at: now, ...payload };
        _posts = [newPost, ..._posts];
        return newPost;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _posts = _posts.map(p => String(p._id) === String(id) ? { ...p, ...payload, _id: p._id, updated_at: new Date().toISOString() } : p);
        return _posts.find(p => String(p._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _posts.find(p => String(p._id) === String(id));
        _posts = _posts.filter(p => String(p._id) !== String(id));
        return removed || null;
    }
};

export const fetchPosts = createAsyncThunk("blog/fetchPosts", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchPost = createAsyncThunk("blog/fetchPost", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createPost = createAsyncThunk("blog/createPost", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updatePost = createAsyncThunk("blog/updatePost", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deletePost = createAsyncThunk("blog/deletePost", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const blogSlice = createSlice({
    name: "blog",
    initialState: {
        posts: [..._posts],
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
            .addCase(fetchPosts.fulfilled, (s, a) => { s.postLoading = false; s.posts = a.payload; })
            .addCase(fetchPosts.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; })

            .addCase(fetchPost.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(fetchPost.fulfilled, (s, a) => { s.postLoading = false; s.post = a.payload; })
            .addCase(fetchPost.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; })

            .addCase(createPost.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(createPost.fulfilled, (s, a) => { s.postLoading = false; s.posts.unshift(a.payload); })
            .addCase(createPost.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; })

            .addCase(updatePost.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(updatePost.fulfilled, (s, a) => {
                s.postLoading = false;
                s.posts = s.posts.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.post && String(s.post._id) === String(a.payload._id)) s.post = a.payload;
            })
            .addCase(updatePost.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; })

            .addCase(deletePost.pending, s => { s.postLoading = true; s.postError = null; })
            .addCase(deletePost.fulfilled, (s, a) => {
                s.postLoading = false;
                if (a.payload && a.payload._id) {
                    s.posts = s.posts.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.post && String(s.post._id) === String(a.payload._id)) s.post = null;
                }
            })
            .addCase(deletePost.rejected, (s, a) => { s.postLoading = false; s.postError = a.payload || a.error.message; });
    }
});

export const { clearPost, clearPostError } = blogSlice.actions;
export const selectBlog = state => state.blog;
export default blogSlice.reducer;
