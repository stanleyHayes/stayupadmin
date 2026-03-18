import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/roles`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch roles");
    }
});

export const fetchRole = createAsyncThunk("roles/fetchRole", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/roles/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch role");
    }
});

export const createRole = createAsyncThunk("roles/createRole", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/roles`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create role");
    }
});

export const updateRole = createAsyncThunk("roles/updateRole", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/roles/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update role");
    }
});

export const deleteRole = createAsyncThunk("roles/deleteRole", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/roles/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete role");
    }
});

const rolesSlice = createSlice({
    name: "roles",
    initialState: {
        roles: [],
        role: null,
        roleLoading: false,
        roleError: null
    },
    reducers: {
        clearRole(state) { state.role = null; },
        clearRoleError(state) { state.roleError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchRoles.pending, s => { s.roleLoading = true; s.roleError = null; })
            .addCase(fetchRoles.fulfilled, (s, a) => {
                s.roleLoading = false;
                if (Array.isArray(a.payload)) {
                    s.roles = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.roles = a.payload.data;
                } else {
                    s.roles = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchRoles.rejected, (s, a) => { s.roleLoading = false; s.roleError = a.payload || a.error.message; })

            .addCase(fetchRole.pending, s => { s.roleLoading = true; s.roleError = null; })
            .addCase(fetchRole.fulfilled, (s, a) => { s.roleLoading = false; s.role = a.payload; })
            .addCase(fetchRole.rejected, (s, a) => { s.roleLoading = false; s.roleError = a.payload || a.error.message; })

            .addCase(createRole.pending, s => { s.roleLoading = true; s.roleError = null; })
            .addCase(createRole.fulfilled, (s, a) => {
                s.roleLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.roles.unshift(created);
            })
            .addCase(createRole.rejected, (s, a) => { s.roleLoading = false; s.roleError = a.payload || a.error.message; })

            .addCase(updateRole.pending, s => { s.roleLoading = true; s.roleError = null; })
            .addCase(updateRole.fulfilled, (s, a) => {
                s.roleLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.roles = s.roles.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.role && (s.role._id ?? s.role.id) === id) s.role = { ...s.role, ...updated };
                }
            })
            .addCase(updateRole.rejected, (s, a) => { s.roleLoading = false; s.roleError = a.payload || a.error.message; })

            .addCase(deleteRole.pending, s => { s.roleLoading = true; s.roleError = null; })
            .addCase(deleteRole.fulfilled, (s, a) => {
                s.roleLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.roles = s.roles.filter(x => (x._id ?? x.id) !== id);
                    if (s.role && (s.role._id ?? s.role.id) === id) s.role = null;
                }
            })
            .addCase(deleteRole.rejected, (s, a) => { s.roleLoading = false; s.roleError = a.payload || a.error.message; });
    }
});

export const { clearRole, clearRoleError } = rolesSlice.actions;
export const selectRoles = state => state.roles;
export default rolesSlice.reducer;
