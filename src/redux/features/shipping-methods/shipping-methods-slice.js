import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchShippingMethods = createAsyncThunk("shippingMethods/fetchShippingMethods", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/shipping-methods`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch shipping methods");
    }
});

export const fetchShippingMethod = createAsyncThunk("shippingMethods/fetchShippingMethod", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/shipping-methods/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch shipping method");
    }
});

export const updateShippingMethod = createAsyncThunk("shippingMethods/updateShippingMethod", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/shipping-methods/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update shipping method");
    }
});

const shippingMethodsSlice = createSlice({
    name: "shippingMethods",
    initialState: {
        shippingMethods: [],
        shippingMethod: null,
        shippingMethodLoading: false,
        shippingMethodError: null
    },
    reducers: {
        clearShippingMethod(state) { state.shippingMethod = null; },
        clearShippingMethodError(state) { state.shippingMethodError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchShippingMethods.pending, s => { s.shippingMethodLoading = true; s.shippingMethodError = null; })
            .addCase(fetchShippingMethods.fulfilled, (s, a) => {
                s.shippingMethodLoading = false;
                if (Array.isArray(a.payload)) {
                    s.shippingMethods = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.shippingMethods = a.payload.data;
                } else {
                    s.shippingMethods = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchShippingMethods.rejected, (s, a) => { s.shippingMethodLoading = false; s.shippingMethodError = a.payload || a.error.message; })

            .addCase(fetchShippingMethod.pending, s => { s.shippingMethodLoading = true; s.shippingMethodError = null; })
            .addCase(fetchShippingMethod.fulfilled, (s, a) => { s.shippingMethodLoading = false; s.shippingMethod = a.payload?.data ?? a.payload; })
            .addCase(fetchShippingMethod.rejected, (s, a) => { s.shippingMethodLoading = false; s.shippingMethodError = a.payload || a.error.message; })

            .addCase(updateShippingMethod.pending, s => { s.shippingMethodLoading = true; s.shippingMethodError = null; })
            .addCase(updateShippingMethod.fulfilled, (s, a) => {
                s.shippingMethodLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.shippingMethods = s.shippingMethods.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.shippingMethod && (s.shippingMethod._id ?? s.shippingMethod.id) === id) s.shippingMethod = { ...s.shippingMethod, ...updated };
                }
            })
            .addCase(updateShippingMethod.rejected, (s, a) => { s.shippingMethodLoading = false; s.shippingMethodError = a.payload || a.error.message; });
    }
});

export const { clearShippingMethod, clearShippingMethodError } = shippingMethodsSlice.actions;
export const selectShippingMethods = state => state.shippingMethods;
export default shippingMethodsSlice.reducer;
