import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchInvitations = createAsyncThunk("invitations/fetchInvitations", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/invitations`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch invitations");
    }
});

export const fetchInvitation = createAsyncThunk("invitations/fetchInvitation", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/invitations/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch invitation");
    }
});

export const createInvitation = createAsyncThunk("invitations/createInvitation", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/invitations`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create invitation");
    }
});

export const updateInvitation = createAsyncThunk("invitations/updateInvitation", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/invitations/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update invitation");
    }
});

export const deleteInvitation = createAsyncThunk("invitations/deleteInvitation", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/invitations/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete invitation");
    }
});

const invitationsSlice = createSlice({
    name: "invitations",
    initialState: {
        invitations: [],
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
            .addCase(fetchInvitations.fulfilled, (s, a) => {
                s.invitationLoading = false;
                if (Array.isArray(a.payload)) {
                    s.invitations = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.invitations = a.payload.data;
                } else {
                    s.invitations = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchInvitations.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; })

            .addCase(fetchInvitation.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(fetchInvitation.fulfilled, (s, a) => { s.invitationLoading = false; s.invitation = a.payload?.data ?? a.payload; })
            .addCase(fetchInvitation.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; })

            .addCase(createInvitation.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(createInvitation.fulfilled, (s, a) => {
                s.invitationLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.invitations.unshift(created);
            })
            .addCase(createInvitation.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; })

            .addCase(updateInvitation.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(updateInvitation.fulfilled, (s, a) => {
                s.invitationLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.invitations = s.invitations.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.invitation && (s.invitation._id ?? s.invitation.id) === id) s.invitation = { ...s.invitation, ...updated };
                }
            })
            .addCase(updateInvitation.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; })

            .addCase(deleteInvitation.pending, s => { s.invitationLoading = true; s.invitationError = null; })
            .addCase(deleteInvitation.fulfilled, (s, a) => {
                s.invitationLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.invitations = s.invitations.filter(x => (x._id ?? x.id) !== id);
                    if (s.invitation && (s.invitation._id ?? s.invitation.id) === id) s.invitation = null;
                }
            })
            .addCase(deleteInvitation.rejected, (s, a) => { s.invitationLoading = false; s.invitationError = a.payload || a.error.message; });
    }
});

export const { clearInvitation, clearInvitationError } = invitationsSlice.actions;
export const selectInvitations = state => state.invitations;
export default invitationsSlice.reducer;
