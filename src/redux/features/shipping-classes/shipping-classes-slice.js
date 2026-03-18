import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchShippingClasses = createAsyncThunk("shippingClasses/fetchShippingClasses", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/shipping-classes`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch shipping classes");
    }
});

export const fetchShippingClass = createAsyncThunk("shippingClasses/fetchShippingClass", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/shipping-classes/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch shipping class");
    }
});

export const createShippingClass = createAsyncThunk("shippingClasses/createShippingClass", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/shipping-classes`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create shipping class");
    }
});

export const updateShippingClass = createAsyncThunk("shippingClasses/updateShippingClass", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/shipping-classes/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update shipping class");
    }
});

export const deleteShippingClass = createAsyncThunk("shippingClasses/deleteShippingClass", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/shipping-classes/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete shipping class");
    }
});

const shippingClassesSlice = createSlice({
    name: "shippingClasses",
    initialState: {
        shippingClasses: [],
        shippingClass: null,
        shippingClassLoading: false,
        shippingClassError: null
    },
    reducers: {
        clearShippingClass(state) { state.shippingClass = null; },
        clearShippingClassError(state) { state.shippingClassError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchShippingClasses.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(fetchShippingClasses.fulfilled, (s, a) => {
                s.shippingClassLoading = false;
                if (Array.isArray(a.payload)) {
                    s.shippingClasses = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.shippingClasses = a.payload.data;
                } else {
                    s.shippingClasses = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchShippingClasses.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; })

            .addCase(fetchShippingClass.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(fetchShippingClass.fulfilled, (s, a) => { s.shippingClassLoading = false; s.shippingClass = a.payload?.data ?? a.payload; })
            .addCase(fetchShippingClass.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; })

            .addCase(createShippingClass.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(createShippingClass.fulfilled, (s, a) => {
                s.shippingClassLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.shippingClasses.unshift(created);
            })
            .addCase(createShippingClass.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; })

            .addCase(updateShippingClass.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(updateShippingClass.fulfilled, (s, a) => {
                s.shippingClassLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.shippingClasses = s.shippingClasses.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.shippingClass && (s.shippingClass._id ?? s.shippingClass.id) === id) s.shippingClass = { ...s.shippingClass, ...updated };
                }
            })
            .addCase(updateShippingClass.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; })

            .addCase(deleteShippingClass.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(deleteShippingClass.fulfilled, (s, a) => {
                s.shippingClassLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.shippingClasses = s.shippingClasses.filter(x => (x._id ?? x.id) !== id);
                    if (s.shippingClass && (s.shippingClass._id ?? s.shippingClass.id) === id) s.shippingClass = null;
                }
            })
            .addCase(deleteShippingClass.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; });
    }
});

export const { clearShippingClass, clearShippingClassError } = shippingClassesSlice.actions;
export const selectShippingClasses = state => state.shippingClasses;
export default shippingClassesSlice.reducer;
