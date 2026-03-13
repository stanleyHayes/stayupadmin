import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invitations as seedInvitations } from "./invitations";

let _invitations = [...seedInvitations];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._invitations];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(inv =>
                (inv.email || "").toLowerCase().includes(q) ||
                (inv.role || "").toLowerCase().includes(q) ||
                (inv.invited_by || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(inv => inv.status === params.status);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _invitations.find(inv => String(inv._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `inv${Date.now()}`;
        const token = `tok_${Math.random().toString(36).substr(2, 8)}`;
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const newInv = { _id, token, status: "PENDING", expires_at, created_at: new Date().toISOString(), ...payload };
        _invitations = [newInv, ..._invitations];
        return newInv;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _invitations = _invitations.map(inv => String(inv._id) === String(id) ? { ...inv, ...payload, _id: inv._id } : inv);
        return _invitations.find(inv => String(inv._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _invitations.find(inv => String(inv._id) === String(id));
        _invitations = _invitations.filter(inv => String(inv._id) !== String(id));
        return removed || null;
    }
};

export const fetchInvitations = createAsyncThunk("invitations/fetchInvitations", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchInvitation = createAsyncThunk("invitations/fetchInvitation", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createInvitation = createAsyncThunk("invitations/createInvitation", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateInvitation = createAsyncThunk("invitations/updateInvitation", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteInvitation = createAsyncThunk("invitations/deleteInvitation", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const invitationsSlice = createSlice({
    name: "invitations",
    initialState: {
        invitations: [..._invitations],
        invitation: null,
        invitationLoading: false,
        invitationError: null
    },
    reducers: {
        clearInvitation(state) { state.invitation = null; },
        clearInvitationError(state) { state.invitationError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchInvitations.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(fetchInvitations.fulfilled, (s, a) => { s.invitationLoading = false; s.invitations = a.payload; })
            .addCase(fetchInvitations.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; })

            .addCase(fetchInvitation.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(fetchInvitation.fulfilled, (s, a) => { s.invitationLoading = false; s.invitation = a.payload; })
            .addCase(fetchInvitation.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; })

            .addCase(createInvitation.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(createInvitation.fulfilled, (s, a) => { s.invitationLoading = false; s.invitations.unshift(a.payload); })
            .addCase(createInvitation.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; })

            .addCase(updateInvitation.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(updateInvitation.fulfilled, (s, a) => {
                s.invitationLoading = false;
                s.invitations = s.invitations.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.invitation && String(s.invitation._id) === String(a.payload._id)) s.invitation = a.payload;
            })
            .addCase(updateInvitation.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; })

            .addCase(deleteInvitation.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(deleteInvitation.fulfilled, (s, a) => {
                s.invitationLoading = false;
                if (a.payload && a.payload._id) {
                    s.invitations = s.invitations.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.invitation && String(s.invitation._id) === String(a.payload._id)) s.invitation = null;
                }
            })
            .addCase(deleteInvitation.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; });
    }
});

export const { clearInvitation, clearInvitationError } = invitationsSlice.actions;
export const selectInvitations = state => state.invitations;
export default invitationsSlice.reducer;
