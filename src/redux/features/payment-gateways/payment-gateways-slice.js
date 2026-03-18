import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchPaymentGateways = createAsyncThunk("paymentGateways/fetchPaymentGateways", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/payment-gateways`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch payment gateways");
    }
});

export const fetchPaymentGateway = createAsyncThunk("paymentGateways/fetchPaymentGateway", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/payment-gateways/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch payment gateway");
    }
});

export const createPaymentGateway = createAsyncThunk("paymentGateways/createPaymentGateway", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/payment-gateways`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create payment gateway");
    }
});

export const updatePaymentGateway = createAsyncThunk("paymentGateways/updatePaymentGateway", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/payment-gateways/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update payment gateway");
    }
});

export const deletePaymentGateway = createAsyncThunk("paymentGateways/deletePaymentGateway", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/payment-gateways/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete payment gateway");
    }
});

const paymentGatewaysSlice = createSlice({
    name: "paymentGateways",
    initialState: {
        paymentGateways: [],
        paymentGateway: null,
        paymentGatewayLoading: false,
        paymentGatewayError: null
    },
    reducers: {
        clearPaymentGateway(state) { state.paymentGateway = null; },
        clearPaymentGatewayError(state) { state.paymentGatewayError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPaymentGateways.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(fetchPaymentGateways.fulfilled, (s, a) => {
                s.paymentGatewayLoading = false;
                if (Array.isArray(a.payload)) {
                    s.paymentGateways = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.paymentGateways = a.payload.data;
                } else {
                    s.paymentGateways = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchPaymentGateways.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; })

            .addCase(fetchPaymentGateway.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(fetchPaymentGateway.fulfilled, (s, a) => { s.paymentGatewayLoading = false; s.paymentGateway = a.payload?.data ?? a.payload; })
            .addCase(fetchPaymentGateway.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; })

            .addCase(createPaymentGateway.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(createPaymentGateway.fulfilled, (s, a) => {
                s.paymentGatewayLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.paymentGateways.unshift(created);
            })
            .addCase(createPaymentGateway.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; })

            .addCase(updatePaymentGateway.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(updatePaymentGateway.fulfilled, (s, a) => {
                s.paymentGatewayLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.paymentGateways = s.paymentGateways.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.paymentGateway && (s.paymentGateway._id ?? s.paymentGateway.id) === id) s.paymentGateway = { ...s.paymentGateway, ...updated };
                }
            })
            .addCase(updatePaymentGateway.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; })

            .addCase(deletePaymentGateway.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(deletePaymentGateway.fulfilled, (s, a) => {
                s.paymentGatewayLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.paymentGateways = s.paymentGateways.filter(x => (x._id ?? x.id) !== id);
                    if (s.paymentGateway && (s.paymentGateway._id ?? s.paymentGateway.id) === id) s.paymentGateway = null;
                }
            })
            .addCase(deletePaymentGateway.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; });
    }
});

export const { clearPaymentGateway, clearPaymentGatewayError } = paymentGatewaysSlice.actions;
export const selectPaymentGateways = state => state.paymentGateways;
export default paymentGatewaysSlice.reducer;
