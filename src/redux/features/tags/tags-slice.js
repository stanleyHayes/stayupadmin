// src/redux/features/tags/tags-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tags } from "./tags.js";

// --- Fake in-memory API for demo ---
// Replace these with real API calls to your backend / WooCommerce endpoints.
let _tags = [...tags];
const fakeApi = {
    list: async (params = {}) => {
        // simulate delay
        await new Promise(r => setTimeout(r, 80));
        let res = [..._tags];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(t => t.name.toLowerCase().includes(q) || (t.slug || "").toLowerCase().includes(q));
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _tags.find(t => Number(t.id) === Number(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const id = _tags.length ? Math.max(..._tags.map(t => t.id)) + 1 : 1;
        const slug = payload.slug || (payload.name || "").toLowerCase().replace(/\s+/g, "-");
        const newTag = { id, ...payload, slug, count: payload.count ?? 0 };
        _tags = [newTag, ..._tags];
        return newTag;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _tags = _tags.map(t => (Number(t.id) === Number(id) ? { ...t, ...payload, id: Number(id) } : t));
        return _tags.find(t => Number(t.id) === Number(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _tags.find(t => Number(t.id) === Number(id));
        _tags = _tags.filter(t => Number(t.id) !== Number(id));
        return removed || null;
    }
};

// --- Thunks ---
export const fetchTags = createAsyncThunk("tags/fetchTags", async (params, { rejectWithValue }) => {
    try {
        const res = await fakeApi.list(params);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

export const fetchTag = createAsyncThunk("tags/fetchTag", async (id, { rejectWithValue }) => {
    try {
        const res = await fakeApi.get(id);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

export const createTag = createAsyncThunk("tags/createTag", async (payload, { rejectWithValue }) => {
    try {
        const res = await fakeApi.create(payload);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

export const updateTag = createAsyncThunk("tags/updateTag", async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await fakeApi.update(id, data);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

export const deleteTag = createAsyncThunk("tags/deleteTag", async (id, { rejectWithValue }) => {
    try {
        const res = await fakeApi.remove(id);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

// --- Slice ---
const tagsSlice = createSlice({
    name: "tags",
    initialState: {
        tags: [],
        tag: null,
        loading: false,
        error: null
    },
    reducers: {
        // optional synchronous helpers
        clearTag(state) {
            state.tag = null;
        }
    },
    extraReducers: builder => {
        builder
            // fetchTags
            .addCase(fetchTags.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchTags.fulfilled, (s, a) => { s.loading = false; s.tags = a.payload; })
            .addCase(fetchTags.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            // fetchTag
            .addCase(fetchTag.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchTag.fulfilled, (s, a) => { s.loading = false; s.tag = a.payload; })
            .addCase(fetchTag.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            // createTag
            .addCase(createTag.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(createTag.fulfilled, (s, a) => { s.loading = false; s.tags.unshift(a.payload); })
            .addCase(createTag.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            // updateTag
            .addCase(updateTag.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(updateTag.fulfilled, (s, a) => {
                s.loading = false;
                s.tags = s.tags.map(t => (Number(t.id) === Number(a.payload.id) ? a.payload : t));
                if (s.tag && Number(s.tag.id) === Number(a.payload.id)) s.tag = a.payload;
            })
            .addCase(updateTag.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            // deleteTag
            .addCase(deleteTag.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(deleteTag.fulfilled, (s, a) => {
                s.loading = false;
                if (a.payload && a.payload.id) {
                    s.tags = s.tags.filter(t => Number(t.id) !== Number(a.payload.id));
                    if (s.tag && Number(s.tag.id) === Number(a.payload.id)) s.tag = null;
                }
            })
            .addCase(deleteTag.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; });
    }
});

export const { clearTag } = tagsSlice.actions;
export const selectTags = state => state.tags;
export default tagsSlice.reducer;
