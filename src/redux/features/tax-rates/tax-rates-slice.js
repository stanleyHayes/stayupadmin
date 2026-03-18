import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchTaxRates = createAsyncThunk("taxRates/fetchTaxRates", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-rates`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch tax rates");
    }
});

export const fetchTaxRate = createAsyncThunk("taxRates/fetchTaxRate", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-rates/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch tax rate");
    }
});

export const createTaxRate = createAsyncThunk("taxRates/createTaxRate", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-rates`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create tax rate");
    }
});

export const updateTaxRate = createAsyncThunk("taxRates/updateTaxRate", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-rates/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update tax rate");
    }
});

export const deleteTaxRate = createAsyncThunk("taxRates/deleteTaxRate", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/tax-rates/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete tax rate");
    }
});

const taxRatesSlice = createSlice({
    name: "taxRates",
    initialState: {
        taxRates: [],
        taxRate: null,
        taxRateLoading: false,
        taxRateError: null
    },
    reducers: {
        clearTaxRate(state) { state.taxRate = null; },
        clearTaxRateError(state) { state.taxRateError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTaxRates.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(fetchTaxRates.fulfilled, (s, a) => {
                s.taxRateLoading = false;
                if (Array.isArray(a.payload)) {
                    s.taxRates = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.taxRates = a.payload.data;
                } else {
                    s.taxRates = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchTaxRates.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; })

            .addCase(fetchTaxRate.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(fetchTaxRate.fulfilled, (s, a) => { s.taxRateLoading = false; s.taxRate = a.payload?.data ?? a.payload; })
            .addCase(fetchTaxRate.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; })

            .addCase(createTaxRate.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(createTaxRate.fulfilled, (s, a) => {
                s.taxRateLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.taxRates.unshift(created);
            })
            .addCase(createTaxRate.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; })

            .addCase(updateTaxRate.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(updateTaxRate.fulfilled, (s, a) => {
                s.taxRateLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.taxRates = s.taxRates.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.taxRate && (s.taxRate._id ?? s.taxRate.id) === id) s.taxRate = { ...s.taxRate, ...updated };
                }
            })
            .addCase(updateTaxRate.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; })

            .addCase(deleteTaxRate.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(deleteTaxRate.fulfilled, (s, a) => {
                s.taxRateLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.taxRates = s.taxRates.filter(x => (x._id ?? x.id) !== id);
                    if (s.taxRate && (s.taxRate._id ?? s.taxRate.id) === id) s.taxRate = null;
                }
            })
            .addCase(deleteTaxRate.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; });
    }
});

export const { clearTaxRate, clearTaxRateError } = taxRatesSlice.actions;
export const selectTaxRates = state => state.taxRates;
export default taxRatesSlice.reducer;
