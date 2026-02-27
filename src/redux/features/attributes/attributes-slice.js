// src/redux/features/attributes/attributes-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { attributes } from "./attributes.js";

// In-memory fake API — replace with your backend / WooCommerce endpoints when ready.
let _attributes = [...attributes];
const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._attributes];
        if (params.search) {
            const q = String(params.search).toLowerCase();
            res = res.filter(a => a.name.toLowerCase().includes(q) || (a.slug || "").toLowerCase().includes(q));
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _attributes.find(a => Number(a.id) === Number(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const id = _attributes.length ? Math.max(..._attributes.map(a => a.id)) + 1 : 1;
        const slug = payload.slug || (payload.name || "").toLowerCase().replace(/\s+/g, "-");
        const newAttr = { id, ...payload, slug, terms_count: payload.terms_count ?? 0 };
        _attributes = [newAttr, ..._attributes];
        return newAttr;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _attributes = _attributes.map(a => (Number(a.id) === Number(id) ? { ...a, ...payload, id: Number(id) } : a));
        return _attributes.find(a => Number(a.id) === Number(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _attributes.find(a => Number(a.id) === Number(id));
        _attributes = _attributes.filter(a => Number(a.id) !== Number(id));
        return removed || null;
    }
};

// Thunks
export const fetchAttributes = createAsyncThunk("attributes/fetchAttributes", async (params, { rejectWithValue }) => {
    try {
        const res = await fakeApi.list(params);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

export const fetchAttribute = createAsyncThunk("attributes/fetchAttribute", async (id, { rejectWithValue }) => {
    try {
        const res = await fakeApi.get(id);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

export const createAttribute = createAsyncThunk("attributes/createAttribute", async (payload, { rejectWithValue }) => {
    try {
        const res = await fakeApi.create(payload);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

export const updateAttribute = createAsyncThunk("attributes/updateAttribute", async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await fakeApi.update(id, data);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

export const deleteAttribute = createAsyncThunk("attributes/deleteAttribute", async (id, { rejectWithValue }) => {
    try {
        const res = await fakeApi.remove(id);
        return res;
    } catch (e) {
        return rejectWithValue(String(e));
    }
});

// Slice
const attributesSlice = createSlice({
    name: "attributes",
    initialState: {
        attributes: [],
        attribute: null,
        loading: false,
        error: null
    },
    reducers: {
        clearAttribute(state) {
            state.attribute = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAttributes.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchAttributes.fulfilled, (s, a) => { s.loading = false; s.attributes = a.payload; })
            .addCase(fetchAttributes.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(fetchAttribute.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchAttribute.fulfilled, (s, a) => { s.loading = false; s.attribute = a.payload; })
            .addCase(fetchAttribute.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(createAttribute.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(createAttribute.fulfilled, (s, a) => { s.loading = false; s.attributes.unshift(a.payload); })
            .addCase(createAttribute.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(updateAttribute.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(updateAttribute.fulfilled, (s, a) => {
                s.loading = false;
                s.attributes = s.attributes.map(x => (Number(x.id) === Number(a.payload.id) ? a.payload : x));
                if (s.attribute && Number(s.attribute.id) === Number(a.payload.id)) s.attribute = a.payload;
            })
            .addCase(updateAttribute.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; })

            .addCase(deleteAttribute.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(deleteAttribute.fulfilled, (s, a) => {
                s.loading = false;
                if (a.payload && a.payload.id) {
                    s.attributes = s.attributes.filter(t => Number(t.id) !== Number(a.payload.id));
                    if (s.attribute && Number(s.attribute.id) === Number(a.payload.id)) s.attribute = null;
                }
            })
            .addCase(deleteAttribute.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; });
    }
});

export const { clearAttribute } = attributesSlice.actions;
export const selectAttributes = state => state.attributes;
export default attributesSlice.reducer;
