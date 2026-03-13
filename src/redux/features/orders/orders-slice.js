import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orders as seedOrders } from "./orders";

let _orders = seedOrders.map((o, i) => ({ ...o, _id: o._id ?? i + 1 }));

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._orders];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(o =>
                (o.number || "").toLowerCase().includes(q) ||
                (o.customer?.name || "").toLowerCase().includes(q) ||
                (o.status || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(o => o.status === params.status);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _orders.find(o => String(o._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = _orders.length ? Math.max(..._orders.map(o => Number(o._id) || 0)) + 1 : 1;
        const num = `#${_id}`;
        const newOrder = { _id, number: num, createdAt: new Date().toISOString(), ...payload };
        _orders = [newOrder, ..._orders];
        return newOrder;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _orders = _orders.map(o => String(o._id) === String(id) ? { ...o, ...payload, _id: o._id } : o);
        return _orders.find(o => String(o._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _orders.find(o => String(o._id) === String(id));
        _orders = _orders.filter(o => String(o._id) !== String(id));
        return removed || null;
    }
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchOrder = createAsyncThunk("orders/fetchOrder", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createOrder = createAsyncThunk("orders/createOrder", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateOrder = createAsyncThunk("orders/updateOrder", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteOrder = createAsyncThunk("orders/deleteOrder", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [..._orders],
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
            .addCase(fetchOrders.fulfilled, (s, a) => { s.orderLoading = false; s.orders = a.payload; })
            .addCase(fetchOrders.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; })

            .addCase(fetchOrder.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(fetchOrder.fulfilled, (s, a) => { s.orderLoading = false; s.order = a.payload; })
            .addCase(fetchOrder.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; })

            .addCase(createOrder.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(createOrder.fulfilled, (s, a) => { s.orderLoading = false; s.orders.unshift(a.payload); })
            .addCase(createOrder.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; })

            .addCase(updateOrder.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(updateOrder.fulfilled, (s, a) => {
                s.orderLoading = false;
                s.orders = s.orders.map(o => String(o._id) === String(a.payload._id) ? a.payload : o);
                if (s.order && String(s.order._id) === String(a.payload._id)) s.order = a.payload;
            })
            .addCase(updateOrder.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; })

            .addCase(deleteOrder.pending, s => { s.orderLoading = true; s.orderError = null; })
            .addCase(deleteOrder.fulfilled, (s, a) => {
                s.orderLoading = false;
                if (a.payload && a.payload._id) {
                    s.orders = s.orders.filter(o => String(o._id) !== String(a.payload._id));
                    if (s.order && String(s.order._id) === String(a.payload._id)) s.order = null;
                }
            })
            .addCase(deleteOrder.rejected, (s, a) => { s.orderLoading = false; s.orderError = a.payload || a.error.message; });
    }
});

export const { clearOrder, clearOrderError } = ordersSlice.actions;
export const selectOrder = state => state.orders;
export default ordersSlice.reducer;
