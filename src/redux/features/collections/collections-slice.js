import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchCollections = createAsyncThunk("collections/fetchCollections", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/collections`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch collections");
    }
});

export const fetchCollection = createAsyncThunk("collections/fetchCollection", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/collections/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch collection");
    }
});

export const createCollection = createAsyncThunk("collections/createCollection", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/collections`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create collection");
    }
});

export const updateCollection = createAsyncThunk("collections/updateCollection", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/collections/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update collection");
    }
});

export const deleteCollection = createAsyncThunk("collections/deleteCollection", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/collections/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete collection");
    }
});

const collectionsSlice = createSlice({
    name: "collections",
    initialState: {
        collections: [],
        collection: null,
        collectionLoading: false,
        collectionError: null
    },
    reducers: {
        clearCollection(state) { state.collection = null; },
        clearCollectionError(state) { state.collectionError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchCollections.pending, s => { s.collectionLoading = true; s.collectionError = null; })
            .addCase(fetchCollections.fulfilled, (s, a) => {
                s.collectionLoading = false;
                if (Array.isArray(a.payload)) s.collections = a.payload;
                else if (a.payload && Array.isArray(a.payload.data)) s.collections = a.payload.data;
                else s.collections = a.payload ? [a.payload] : [];
            })
            .addCase(fetchCollections.rejected, (s, a) => { s.collectionLoading = false; s.collectionError = a.payload || a.error.message; })

            .addCase(fetchCollection.pending, s => { s.collectionLoading = true; s.collectionError = null; })
            .addCase(fetchCollection.fulfilled, (s, a) => { s.collectionLoading = false; s.collection = a.payload.data; })
            .addCase(fetchCollection.rejected, (s, a) => { s.collectionLoading = false; s.collectionError = a.payload || a.error.message; })

            .addCase(createCollection.pending, s => { s.collectionLoading = true; s.collectionError = null; })
            .addCase(createCollection.fulfilled, (s, a) => {
                s.collectionLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.collections.unshift(created);
            })
            .addCase(createCollection.rejected, (s, a) => { s.collectionLoading = false; s.collectionError = a.payload || a.error.message; })

            .addCase(updateCollection.pending, s => { s.collectionLoading = true; s.collectionError = null; })
            .addCase(updateCollection.fulfilled, (s, a) => {
                s.collectionLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.collections = s.collections.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.collection && (s.collection._id ?? s.collection.id) === id) s.collection = { ...s.collection, ...updated };
                }
            })
            .addCase(updateCollection.rejected, (s, a) => { s.collectionLoading = false; s.collectionError = a.payload || a.error.message; })

            .addCase(deleteCollection.pending, s => { s.collectionLoading = true; s.collectionError = null; })
            .addCase(deleteCollection.fulfilled, (s, a) => {
                s.collectionLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.collections = s.collections.filter(x => (x._id ?? x.id) !== id);
                    if (s.collection && (s.collection._id ?? s.collection.id) === id) s.collection = null;
                }
            })
            .addCase(deleteCollection.rejected, (s, a) => { s.collectionLoading = false; s.collectionError = a.payload || a.error.message; });
    }
});

export const { clearCollection, clearCollectionError } = collectionsSlice.actions;
export const selectCollections = state => state.collections;
export default collectionsSlice.reducer;
