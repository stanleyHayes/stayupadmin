import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchAttributes = createAsyncThunk("attributes/fetchAttributes", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/attributes`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch attributes");
    }
});

export const fetchAttribute = createAsyncThunk("attributes/fetchAttribute", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/attributes/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch attribute");
    }
});

export const createAttribute = createAsyncThunk("attributes/createAttribute", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/attributes`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create attribute");
    }
});

export const updateAttribute = createAsyncThunk("attributes/updateAttribute", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/attributes/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update attribute");
    }
});

export const deleteAttribute = createAsyncThunk("attributes/deleteAttribute", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/attributes/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete attribute");
    }
});

const attributesSlice = createSlice({
    name: "attributes",
    initialState: {
        attributes: [],
        attribute: null,
        loading: false,
        error: null
    },
    reducers: {
        clearAttribute(state) { state.attribute = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAttributes.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchAttributes.fulfilled, (s, a) => {
                s.loading = false;
                if (Array.isArray(a.payload)) {
                    s.attributes = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.attributes = a.payload.data;
                } else {
                    s.attributes = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchAttributes.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(fetchAttribute.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchAttribute.fulfilled, (s, a) => { s.loading = false; s.attribute = a.payload?.data ?? a.payload; })
            .addCase(fetchAttribute.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(createAttribute.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(createAttribute.fulfilled, (s, a) => {
                s.loading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.attributes.unshift(created);
            })
            .addCase(createAttribute.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(updateAttribute.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(updateAttribute.fulfilled, (s, a) => {
                s.loading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.attributes = s.attributes.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.attribute && (s.attribute._id ?? s.attribute.id) === id) s.attribute = { ...s.attribute, ...updated };
                }
            })
            .addCase(updateAttribute.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(deleteAttribute.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(deleteAttribute.fulfilled, (s, a) => {
                s.loading = false;
                const id = a.payload?.id;
                if (id) {
                    s.attributes = s.attributes.filter(x => (x._id ?? x.id) !== id);
                    if (s.attribute && (s.attribute._id ?? s.attribute.id) === id) s.attribute = null;
                }
            })
            .addCase(deleteAttribute.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; });
    }
});

export const { clearAttribute } = attributesSlice.actions;
export const selectAttributes = state => state.attributes;
export default attributesSlice.reducer;
