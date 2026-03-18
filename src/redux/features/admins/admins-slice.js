import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchAdmins = createAsyncThunk("admins/fetchAdmins", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/admins`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch admins");
    }
});

export const fetchAdmin = createAsyncThunk("admins/fetchAdmin", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/admins/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch admin");
    }
});

export const createAdmin = createAsyncThunk("admins/createAdmin", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/admins`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create admin");
    }
});

export const updateAdmin = createAsyncThunk("admins/updateAdmin", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/admins/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update admin");
    }
});

export const deleteAdmin = createAsyncThunk("admins/deleteAdmin", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/admins/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete admin");
    }
});

const adminsSlice = createSlice({
    name: "admins",
    initialState: {
        admins: [],
        admin: null,
        adminLoading: false,
        adminError: null
    },
    reducers: {
        clearAdmin(state) { state.admin = null; },
        clearAdminError(state) { state.adminError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAdmins.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(fetchAdmins.fulfilled, (s, a) => {
                s.adminLoading = false;
                if (Array.isArray(a.payload)) {
                    s.admins = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.admins = a.payload.data;
                } else {
                    s.admins = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchAdmins.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; })

            .addCase(fetchAdmin.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(fetchAdmin.fulfilled, (s, a) => { s.adminLoading = false; s.admin = a.payload?.data ?? a.payload; })
            .addCase(fetchAdmin.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; })

            .addCase(createAdmin.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(createAdmin.fulfilled, (s, a) => {
                s.adminLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.admins.unshift(created);
            })
            .addCase(createAdmin.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; })

            .addCase(updateAdmin.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(updateAdmin.fulfilled, (s, a) => {
                s.adminLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.admins = s.admins.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.admin && (s.admin._id ?? s.admin.id) === id) s.admin = { ...s.admin, ...updated };
                }
            })
            .addCase(updateAdmin.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; })

            .addCase(deleteAdmin.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(deleteAdmin.fulfilled, (s, a) => {
                s.adminLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.admins = s.admins.filter(x => (x._id ?? x.id) !== id);
                    if (s.admin && (s.admin._id ?? s.admin.id) === id) s.admin = null;
                }
            })
            .addCase(deleteAdmin.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; });
    }
});

export const { clearAdmin, clearAdminError } = adminsSlice.actions;
export const selectAdmins = state => state.admins;
export default adminsSlice.reducer;
