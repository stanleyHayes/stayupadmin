import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentGateways as seedPaymentGateways } from "./payment-gateways";

let _paymentGateways = [...seedPaymentGateways];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._paymentGateways];
        if (params.enabled !== undefined) {
            res = res.filter(g => g.enabled === params.enabled);
        }
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(g =>
                (g.title || "").toLowerCase().includes(q) ||
                (g.description || "").toLowerCase().includes(q)
            );
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _paymentGateways.find(g => String(g._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const newGateway = { ...payload, _id: `pg${Date.now()}`, order: _paymentGateways.length + 1 };
        _paymentGateways.push(newGateway);
        return newGateway;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _paymentGateways = _paymentGateways.map(g => String(g._id) === String(id) ? { ...g, ...payload, _id: g._id } : g);
        return _paymentGateways.find(g => String(g._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        _paymentGateways = _paymentGateways.filter(g => String(g._id) !== String(id));
        return id;
    }
};

export const fetchPaymentGateways = createAsyncThunk("paymentGateways/fetchPaymentGateways", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchPaymentGateway = createAsyncThunk("paymentGateways/fetchPaymentGateway", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createPaymentGateway = createAsyncThunk("paymentGateways/createPaymentGateway", async (data, { rejectWithValue }) => {
    try { return await fakeApi.create(data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updatePaymentGateway = createAsyncThunk("paymentGateways/updatePaymentGateway", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deletePaymentGateway = createAsyncThunk("paymentGateways/deletePaymentGateway", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const paymentGatewaysSlice = createSlice({
    name: "paymentGateways",
    initialState: {
        paymentGateways: [..._paymentGateways],
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
            .addCase(fetchPaymentGateways.fulfilled, (s, a) => { s.paymentGatewayLoading = false; s.paymentGateways = a.payload; })
            .addCase(fetchPaymentGateways.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; })

            .addCase(fetchPaymentGateway.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(fetchPaymentGateway.fulfilled, (s, a) => { s.paymentGatewayLoading = false; s.paymentGateway = a.payload; })
            .addCase(fetchPaymentGateway.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; })

            .addCase(createPaymentGateway.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(createPaymentGateway.fulfilled, (s, a) => {
                s.paymentGatewayLoading = false;
                s.paymentGateways.push(a.payload);
            })
            .addCase(createPaymentGateway.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; })

            .addCase(updatePaymentGateway.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(updatePaymentGateway.fulfilled, (s, a) => {
                s.paymentGatewayLoading = false;
                s.paymentGateways = s.paymentGateways.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.paymentGateway && String(s.paymentGateway._id) === String(a.payload._id)) s.paymentGateway = a.payload;
            })
            .addCase(updatePaymentGateway.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; })

            .addCase(deletePaymentGateway.pending, s => { s.paymentGatewayLoading = true; s.paymentGatewayError = null; })
            .addCase(deletePaymentGateway.fulfilled, (s, a) => {
                s.paymentGatewayLoading = false;
                s.paymentGateways = s.paymentGateways.filter(x => String(x._id) !== String(a.payload));
                if (s.paymentGateway && String(s.paymentGateway._id) === String(a.payload)) s.paymentGateway = null;
            })
            .addCase(deletePaymentGateway.rejected, (s, a) => { s.paymentGatewayLoading = false; s.paymentGatewayError = a.payload || a.error.message; });
    }
});

export const { clearPaymentGateway, clearPaymentGatewayError } = paymentGatewaysSlice.actions;
export const selectPaymentGateways = state => state.paymentGateways;
export default paymentGatewaysSlice.reducer;
