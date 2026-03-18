import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/orders`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch orders");
    }
});

export const fetchOrder = createAsyncThunk("orders/fetchOrder", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/orders/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch order");
    }
});

export const createOrder = createAsyncThunk("orders/createOrder", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/orders`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create order");
    }
});

export const updateOrder = createAsyncThunk("orders/updateOrder", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/orders/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update order");
    }
});

export const deleteOrder = createAsyncThunk("orders/deleteOrder", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/orders/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete order");
    }
});

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        order: null,
        orderLoading: false,
        orderError: null,
    },
    reducers: {
        clearOrder(state) { state.order = null; },
        clearOrderError(state) { state.orderError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchOrders.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(fetchOrders.fulfilled, (s, a) => {
                s.orderLoading = false;
                if (Array.isArray(a.payload)) {
                    s.orders = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.orders = a.payload.data;
                } else {
                    s.orders = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchOrders.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; })

            .addCase(fetchOrder.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(fetchOrder.fulfilled, (s, a) => { s.orderLoading = false; s.order = a.payload?.data ?? a.payload; })
            .addCase(fetchOrder.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; })

            .addCase(createOrder.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(createOrder.fulfilled, (s, a) => {
                s.orderLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.orders.unshift(created);
            })
            .addCase(createOrder.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; })

            .addCase(updateOrder.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(updateOrder.fulfilled, (s, a) => {
                s.orderLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.orders = s.orders.map(o => (o._id ?? o.id) === id ? { ...o, ...updated } : o);
                    if (s.order && (s.order._id ?? s.order.id) === id) s.order = { ...s.order, ...updated };
                }
            })
            .addCase(updateOrder.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; })

            .addCase(deleteOrder.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(deleteOrder.fulfilled, (s, a) => {
                s.orderLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.orders = s.orders.filter(o => (o._id ?? o.id) !== id);
                    if (s.order && (s.order._id ?? s.order.id) === id) s.order = null;
                }
            })
            .addCase(deleteOrder.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; });
    }
});

export const { clearOrder, clearOrderError } = ordersSlice.actions;
export const selectOrder = state => state.orders;
export default ordersSlice.reducer;
