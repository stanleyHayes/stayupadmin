import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { users as seedUsers } from "./users";

let _users = [...seedUsers];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._users];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(u =>
                (u.firstName + " " + u.lastName).toLowerCase().includes(q) ||
                (u.email || "").toLowerCase().includes(q) ||
                (u.username || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(u => u.status === params.status);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _users.find(u => String(u._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `u${Date.now()}`;
        const newUser = { _id, is_verified: false, status: "PENDING", role: "customer", created_at: new Date().toISOString(), ...payload };
        _users = [newUser, ..._users];
        return newUser;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _users = _users.map(u => String(u._id) === String(id) ? { ...u, ...payload, _id: u._id } : u);
        return _users.find(u => String(u._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _users.find(u => String(u._id) === String(id));
        _users = _users.filter(u => String(u._id) !== String(id));
        return removed || null;
    }
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchUser = createAsyncThunk("users/fetchUser", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createUser = createAsyncThunk("users/createUser", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateUser = createAsyncThunk("users/updateUser", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [..._users],
        user: null,
        userLoading: false,
        userError: null
    },
    reducers: {
        clearUser(state) { state.user = null; },
        clearUserError(state) { state.userError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUsers.pending, s => { s.userLoading = true; s.userError = null; })
            .addCase(fetchUsers.fulfilled, (s, a) => { s.userLoading = false; s.users = a.payload; })
            .addCase(fetchUsers.rejected, (s, a) => { s.userLoading = false; s.userError = a.payload || a.error.message; })

            .addCase(fetchUser.pending, s => { s.userLoading = true; s.userError = null; })
            .addCase(fetchUser.fulfilled, (s, a) => { s.userLoading = false; s.user = a.payload; })
            .addCase(fetchUser.rejected, (s, a) => { s.userLoading = false; s.userError = a.payload || a.error.message; })

            .addCase(createUser.pending, s => { s.userLoading = true; s.userError = null; })
            .addCase(createUser.fulfilled, (s, a) => { s.userLoading = false; s.users.unshift(a.payload); })
            .addCase(createUser.rejected, (s, a) => { s.userLoading = false; s.userError = a.payload || a.error.message; })

            .addCase(updateUser.pending, s => { s.userLoading = true; s.userError = null; })
            .addCase(updateUser.fulfilled, (s, a) => {
                s.userLoading = false;
                s.users = s.users.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.user && String(s.user._id) === String(a.payload._id)) s.user = a.payload;
            })
            .addCase(updateUser.rejected, (s, a) => { s.userLoading = false; s.userError = a.payload || a.error.message; })

            .addCase(deleteUser.pending, s => { s.userLoading = true; s.userError = null; })
            .addCase(deleteUser.fulfilled, (s, a) => {
                s.userLoading = false;
                if (a.payload && a.payload._id) {
                    s.users = s.users.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.user && String(s.user._id) === String(a.payload._id)) s.user = null;
                }
            })
            .addCase(deleteUser.rejected, (s, a) => { s.userLoading = false; s.userError = a.payload || a.error.message; });
    }
});

export const { clearUser, clearUserError } = usersSlice.actions;
export const selectUsers = state => state.users;
export default usersSlice.reducer;
