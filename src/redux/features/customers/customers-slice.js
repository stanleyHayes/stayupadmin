import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customers as seedCustomers } from "./customers";

let _customers = [...seedCustomers];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._customers];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(c =>
                (c.name || "").toLowerCase().includes(q) ||
                (c.email || "").toLowerCase().includes(q) ||
                (c.username || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(c => c.status === params.status);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _customers.find(c => String(c._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `c${Date.now()}`;
        const newCustomer = {
            _id,
            is_verified: false,
            status: "ACTIVE",
            total_orders: 0,
            total_spent: { amount: 0, currency: "GBP" },
            created_at: new Date().toISOString(),
            billing_address: {},
            shipping_address: {},
            ...payload
        };
        _customers = [newCustomer, ..._customers];
        return newCustomer;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _customers = _customers.map(c => String(c._id) === String(id) ? { ...c, ...payload, _id: c._id } : c);
        return _customers.find(c => String(c._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _customers.find(c => String(c._id) === String(id));
        _customers = _customers.filter(c => String(c._id) !== String(id));
        return removed || null;
    }
};

export const fetchCustomers = createAsyncThunk("customers/fetchCustomers", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchCustomer = createAsyncThunk("customers/fetchCustomer", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createCustomer = createAsyncThunk("customers/createCustomer", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateCustomer = createAsyncThunk("customers/updateCustomer", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteCustomer = createAsyncThunk("customers/deleteCustomer", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const customersSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [..._customers],
        customer: null,
        customerLoading: false,
        customerError: null,
    },
    reducers: {
        clearCustomer(state) { state.customer = null; },
        clearCustomerError(state) { state.customerError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchCustomers.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(fetchCustomers.fulfilled, (s, a) => { s.customerLoading = false; s.customers = a.payload; })
            .addCase(fetchCustomers.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; })

            .addCase(fetchCustomer.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(fetchCustomer.fulfilled, (s, a) => { s.customerLoading = false; s.customer = a.payload; })
            .addCase(fetchCustomer.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; })

            .addCase(createCustomer.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(createCustomer.fulfilled, (s, a) => { s.customerLoading = false; s.customers.unshift(a.payload); })
            .addCase(createCustomer.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; })

            .addCase(updateCustomer.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(updateCustomer.fulfilled, (s, a) => {
                s.customerLoading = false;
                s.customers = s.customers.map(c => String(c._id) === String(a.payload._id) ? a.payload : c);
                if (s.customer && String(s.customer._id) === String(a.payload._id)) s.customer = a.payload;
            })
            .addCase(updateCustomer.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; })

            .addCase(deleteCustomer.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(deleteCustomer.fulfilled, (s, a) => {
                s.customerLoading = false;
                if (a.payload && a.payload._id) {
                    s.customers = s.customers.filter(c => String(c._id) !== String(a.payload._id));
                    if (s.customer && String(s.customer._id) === String(a.payload._id)) s.customer = null;
                }
            })
            .addCase(deleteCustomer.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; });
    }
});

export const { clearCustomer, clearCustomerError } = customersSlice.actions;
export const selectCustomer = state => state.customers;
export default customersSlice.reducer;
