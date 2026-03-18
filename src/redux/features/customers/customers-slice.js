import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchCustomers = createAsyncThunk("customers/fetchCustomers", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/customers`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch customers");
    }
});

export const fetchCustomer = createAsyncThunk("customers/fetchCustomer", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/customers/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch customer");
    }
});

export const createCustomer = createAsyncThunk("customers/createCustomer", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/customers`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create customer");
    }
});

export const updateCustomer = createAsyncThunk("customers/updateCustomer", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/customers/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update customer");
    }
});

export const deleteCustomer = createAsyncThunk("customers/deleteCustomer", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/customers/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete customer");
    }
});

const customersSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
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
            .addCase(fetchCustomers.fulfilled, (s, a) => {
                s.customerLoading = false;
                if (Array.isArray(a.payload)) {
                    s.customers = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.customers = a.payload.data;
                } else {
                    s.customers = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchCustomers.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; })

            .addCase(fetchCustomer.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(fetchCustomer.fulfilled, (s, a) => { s.customerLoading = false; s.customer = a.payload?.data ?? a.payload; })
            .addCase(fetchCustomer.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; })

            .addCase(createCustomer.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(createCustomer.fulfilled, (s, a) => {
                s.customerLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.customers.unshift(created);
            })
            .addCase(createCustomer.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; })

            .addCase(updateCustomer.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(updateCustomer.fulfilled, (s, a) => {
                s.customerLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.customers = s.customers.map(c => (c._id ?? c.id) === id ? { ...c, ...updated } : c);
                    if (s.customer && (s.customer._id ?? s.customer.id) === id) s.customer = { ...s.customer, ...updated };
                }
            })
            .addCase(updateCustomer.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; })

            .addCase(deleteCustomer.pending, s => { s.customerLoading = true; s.customerError = null; })
            .addCase(deleteCustomer.fulfilled, (s, a) => {
                s.customerLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.customers = s.customers.filter(c => (c._id ?? c.id) !== id);
                    if (s.customer && (s.customer._id ?? s.customer.id) === id) s.customer = null;
                }
            })
            .addCase(deleteCustomer.rejected, (s, a) => { s.customerLoading = false; s.customerError = a.payload || a.error.message; });
    }
});

export const { clearCustomer, clearCustomerError } = customersSlice.actions;
export const selectCustomer = state => state.customers;
export default customersSlice.reducer;
