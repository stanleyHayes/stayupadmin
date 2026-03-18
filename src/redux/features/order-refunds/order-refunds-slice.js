import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchOrderRefunds = createAsyncThunk("orderRefunds/fetchOrderRefunds", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-refunds`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch order refunds");
    }
});

export const fetchOrderRefund = createAsyncThunk("orderRefunds/fetchOrderRefund", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-refunds/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch order refund");
    }
});

export const createOrderRefund = createAsyncThunk("orderRefunds/createOrderRefund", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-refunds`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create order refund");
    }
});

export const updateOrderRefund = createAsyncThunk("orderRefunds/updateOrderRefund", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-refunds/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update order refund");
    }
});

export const deleteOrderRefund = createAsyncThunk("orderRefunds/deleteOrderRefund", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-refunds/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete order refund");
    }
});

const orderRefundsSlice = createSlice({
    name: "orderRefunds",
    initialState: {
        orderRefunds: [],
        orderRefund: null,
        orderRefundLoading: false,
        orderRefundError: null
    },
    reducers: {
        clearOrderRefund(state) { state.orderRefund = null; },
        clearOrderRefundError(state) { state.orderRefundError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchOrderRefunds.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(fetchOrderRefunds.fulfilled, (s, a) => {
                s.orderRefundLoading = false;
                if (Array.isArray(a.payload)) {
                    s.orderRefunds = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.orderRefunds = a.payload.data;
                } else {
                    s.orderRefunds = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchOrderRefunds.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; })

            .addCase(fetchOrderRefund.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(fetchOrderRefund.fulfilled, (s, a) => { s.orderRefundLoading = false; s.orderRefund = a.payload?.data ?? a.payload; })
            .addCase(fetchOrderRefund.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; })

            .addCase(createOrderRefund.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(createOrderRefund.fulfilled, (s, a) => {
                s.orderRefundLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.orderRefunds.unshift(created);
            })
            .addCase(createOrderRefund.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; })

            .addCase(updateOrderRefund.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(updateOrderRefund.fulfilled, (s, a) => {
                s.orderRefundLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.orderRefunds = s.orderRefunds.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.orderRefund && (s.orderRefund._id ?? s.orderRefund.id) === id) s.orderRefund = { ...s.orderRefund, ...updated };
                }
            })
            .addCase(updateOrderRefund.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; })

            .addCase(deleteOrderRefund.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(deleteOrderRefund.fulfilled, (s, a) => {
                s.orderRefundLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.orderRefunds = s.orderRefunds.filter(x => (x._id ?? x.id) !== id);
                    if (s.orderRefund && (s.orderRefund._id ?? s.orderRefund.id) === id) s.orderRefund = null;
                }
            })
            .addCase(deleteOrderRefund.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; });
    }
});

export const { clearOrderRefund, clearOrderRefundError } = orderRefundsSlice.actions;
export const selectOrderRefunds = state => state.orderRefunds;
export default orderRefundsSlice.reducer;
