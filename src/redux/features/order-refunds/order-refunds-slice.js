import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderRefunds as seedOrderRefunds } from "./order-refunds";

let _orderRefunds = [...seedOrderRefunds];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._orderRefunds];
        if (params.order_id) {
            res = res.filter(r => String(r.order_id) === String(params.order_id));
        }
        if (params.status && params.status !== "all") {
            res = res.filter(r => r.status === params.status);
        }
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(r =>
                (r.reason || "").toLowerCase().includes(q) ||
                (r.order_id || "").toLowerCase().includes(q)
            );
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _orderRefunds.find(r => String(r._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `ref${Date.now()}`;
        const newRefund = { _id, status: "PENDING", created_at: new Date().toISOString(), ...payload };
        _orderRefunds = [newRefund, ..._orderRefunds];
        return newRefund;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _orderRefunds = _orderRefunds.map(r => String(r._id) === String(id) ? { ...r, ...payload, _id: r._id } : r);
        return _orderRefunds.find(r => String(r._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _orderRefunds.find(r => String(r._id) === String(id));
        _orderRefunds = _orderRefunds.filter(r => String(r._id) !== String(id));
        return removed || null;
    }
};

export const fetchOrderRefunds = createAsyncThunk("orderRefunds/fetchOrderRefunds", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchOrderRefund = createAsyncThunk("orderRefunds/fetchOrderRefund", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createOrderRefund = createAsyncThunk("orderRefunds/createOrderRefund", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateOrderRefund = createAsyncThunk("orderRefunds/updateOrderRefund", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteOrderRefund = createAsyncThunk("orderRefunds/deleteOrderRefund", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const orderRefundsSlice = createSlice({
    name: "orderRefunds",
    initialState: {
        orderRefunds: [..._orderRefunds],
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
            .addCase(fetchOrderRefunds.fulfilled, (s, a) => { s.orderRefundLoading = false; s.orderRefunds = a.payload; })
            .addCase(fetchOrderRefunds.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; })

            .addCase(fetchOrderRefund.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(fetchOrderRefund.fulfilled, (s, a) => { s.orderRefundLoading = false; s.orderRefund = a.payload; })
            .addCase(fetchOrderRefund.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; })

            .addCase(createOrderRefund.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(createOrderRefund.fulfilled, (s, a) => { s.orderRefundLoading = false; s.orderRefunds.unshift(a.payload); })
            .addCase(createOrderRefund.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; })

            .addCase(updateOrderRefund.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(updateOrderRefund.fulfilled, (s, a) => {
                s.orderRefundLoading = false;
                s.orderRefunds = s.orderRefunds.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.orderRefund && String(s.orderRefund._id) === String(a.payload._id)) s.orderRefund = a.payload;
            })
            .addCase(updateOrderRefund.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; })

            .addCase(deleteOrderRefund.pending, s => { s.orderRefundLoading = true; s.orderRefundError = null; })
            .addCase(deleteOrderRefund.fulfilled, (s, a) => {
                s.orderRefundLoading = false;
                if (a.payload && a.payload._id) {
                    s.orderRefunds = s.orderRefunds.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.orderRefund && String(s.orderRefund._id) === String(a.payload._id)) s.orderRefund = null;
                }
            })
            .addCase(deleteOrderRefund.rejected, (s, a) => { s.orderRefundLoading = false; s.orderRefundError = a.payload || a.error.message; });
    }
});

export const { clearOrderRefund, clearOrderRefundError } = orderRefundsSlice.actions;
export const selectOrderRefunds = state => state.orderRefunds;
export default orderRefundsSlice.reducer;
