import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchTaxClasses = createAsyncThunk("taxClasses/fetchTaxClasses", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-classes`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch tax classes");
    }
});

export const fetchTaxClass = createAsyncThunk("taxClasses/fetchTaxClass", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-classes/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch tax class");
    }
});

export const createTaxClass = createAsyncThunk("taxClasses/createTaxClass", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-classes`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create tax class");
    }
});

export const updateTaxClass = createAsyncThunk("taxClasses/updateTaxClass", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-classes/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update tax class");
    }
});

export const deleteTaxClass = createAsyncThunk("taxClasses/deleteTaxClass", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-classes/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete tax class");
    }
});

const taxClassesSlice = createSlice({
    name: "taxClasses",
    initialState: {
        taxClasses: [],
        taxClass: null,
        taxClassLoading: false,
        taxClassError: null
    },
    reducers: {
        clearTaxClass(state) { state.taxClass = null; },
        clearTaxClassError(state) { state.taxClassError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTaxClasses.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(fetchTaxClasses.fulfilled, (s, a) => {
                s.taxClassLoading = false;
                if (Array.isArray(a.payload)) {
                    s.taxClasses = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.taxClasses = a.payload.data;
                } else {
                    s.taxClasses = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchTaxClasses.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; })

            .addCase(fetchTaxClass.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(fetchTaxClass.fulfilled, (s, a) => { s.taxClassLoading = false; s.taxClass = a.payload?.data ?? a.payload; })
            .addCase(fetchTaxClass.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; })

            .addCase(createTaxClass.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(createTaxClass.fulfilled, (s, a) => {
                s.taxClassLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.taxClasses.unshift(created);
            })
            .addCase(createTaxClass.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; })

            .addCase(updateTaxClass.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(updateTaxClass.fulfilled, (s, a) => {
                s.taxClassLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.taxClasses = s.taxClasses.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.taxClass && (s.taxClass._id ?? s.taxClass.id) === id) s.taxClass = { ...s.taxClass, ...updated };
                }
            })
            .addCase(updateTaxClass.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; })

            .addCase(deleteTaxClass.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(deleteTaxClass.fulfilled, (s, a) => {
                s.taxClassLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.taxClasses = s.taxClasses.filter(x => (x._id ?? x.id) !== id);
                    if (s.taxClass && (s.taxClass._id ?? s.taxClass.id) === id) s.taxClass = null;
                }
            })
            .addCase(deleteTaxClass.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; });
    }
});

export const { clearTaxClass, clearTaxClassError } = taxClassesSlice.actions;
export const selectTaxClasses = state => state.taxClasses;
export default taxClassesSlice.reducer;
