import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchTags = createAsyncThunk("tags/fetchTags", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tags`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch tags");
    }
});

export const fetchTag = createAsyncThunk("tags/fetchTag", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tags/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch tag");
    }
});

export const createTag = createAsyncThunk("tags/createTag", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tags`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create tag");
    }
});

export const updateTag = createAsyncThunk("tags/updateTag", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tags/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update tag");
    }
});

export const deleteTag = createAsyncThunk("tags/deleteTag", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tags/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete tag");
    }
});

const tagsSlice = createSlice({
    name: "tags",
    initialState: {
        tags: [],
        tag: null,
        loading: false,
        error: null
    },
    reducers: {
        clearTag(state) { state.tag = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTags.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchTags.fulfilled, (s, a) => {
                s.loading = false;
                if (Array.isArray(a.payload)) {
                    s.tags = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.tags = a.payload.data;
                } else {
                    s.tags = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchTags.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(fetchTag.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchTag.fulfilled, (s, a) => { s.loading = false; s.tag = a.payload?.data ?? a.payload; })
            .addCase(fetchTag.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(createTag.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(createTag.fulfilled, (s, a) => {
                s.loading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.tags.unshift(created);
            })
            .addCase(createTag.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(updateTag.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(updateTag.fulfilled, (s, a) => {
                s.loading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.tags = s.tags.map(t => (t._id ?? t.id) === id ? { ...t, ...updated } : t);
                    if (s.tag && (s.tag._id ?? s.tag.id) === id) s.tag = { ...s.tag, ...updated };
                }
            })
            .addCase(updateTag.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(deleteTag.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(deleteTag.fulfilled, (s, a) => {
                s.loading = false;
                const id = a.payload?.id;
                if (id) {
                    s.tags = s.tags.filter(t => (t._id ?? t.id) !== id);
                    if (s.tag && (s.tag._id ?? s.tag.id) === id) s.tag = null;
                }
            })
            .addCase(deleteTag.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; });
    }
});

export const { clearTag } = tagsSlice.actions;
export const selectTags = state => state.tags;
export default tagsSlice.reducer;
