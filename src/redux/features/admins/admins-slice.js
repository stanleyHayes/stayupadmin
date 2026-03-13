import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { admins as seedAdmins } from "./admins";

let _admins = [...seedAdmins];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._admins];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(a =>
                (a.firstName + " " + a.lastName).toLowerCase().includes(q) ||
                (a.email || "").toLowerCase().includes(q) ||
                (a.username || "").toLowerCase().includes(q) ||
                (a.role || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(a => a.status === params.status);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _admins.find(a => String(a._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `a${Date.now()}`;
        const newAdmin = { _id, is_verified: false, status: "ACTIVE", role: "admin", created_at: new Date().toISOString(), ...payload };
        _admins = [newAdmin, ..._admins];
        return newAdmin;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _admins = _admins.map(a => String(a._id) === String(id) ? { ...a, ...payload, _id: a._id } : a);
        return _admins.find(a => String(a._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _admins.find(a => String(a._id) === String(id));
        _admins = _admins.filter(a => String(a._id) !== String(id));
        return removed || null;
    }
};

export const fetchAdmins = createAsyncThunk("admins/fetchAdmins", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchAdmin = createAsyncThunk("admins/fetchAdmin", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createAdmin = createAsyncThunk("admins/createAdmin", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateAdmin = createAsyncThunk("admins/updateAdmin", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteAdmin = createAsyncThunk("admins/deleteAdmin", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const adminsSlice = createSlice({
    name: "admins",
    initialState: {
        admins: [..._admins],
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
            .addCase(fetchAdmins.fulfilled, (s, a) => { s.adminLoading = false; s.admins = a.payload; })
            .addCase(fetchAdmins.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; })

            .addCase(fetchAdmin.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(fetchAdmin.fulfilled, (s, a) => { s.adminLoading = false; s.admin = a.payload; })
            .addCase(fetchAdmin.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; })

            .addCase(createAdmin.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(createAdmin.fulfilled, (s, a) => { s.adminLoading = false; s.admins.unshift(a.payload); })
            .addCase(createAdmin.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; })

            .addCase(updateAdmin.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(updateAdmin.fulfilled, (s, a) => {
                s.adminLoading = false;
                s.admins = s.admins.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.admin && String(s.admin._id) === String(a.payload._id)) s.admin = a.payload;
            })
            .addCase(updateAdmin.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; })

            .addCase(deleteAdmin.pending, s => { s.adminLoading = true; s.adminError = null; })
            .addCase(deleteAdmin.fulfilled, (s, a) => {
                s.adminLoading = false;
                if (a.payload && a.payload._id) {
                    s.admins = s.admins.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.admin && String(s.admin._id) === String(a.payload._id)) s.admin = null;
                }
            })
            .addCase(deleteAdmin.rejected, (s, a) => { s.adminLoading = false; s.adminError = a.payload || a.error.message; });
    }
});

export const { clearAdmin, clearAdminError } = adminsSlice.actions;
export const selectAdmins = state => state.admins;
export default adminsSlice.reducer;
