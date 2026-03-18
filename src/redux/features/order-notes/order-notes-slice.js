import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchOrderNotes = createAsyncThunk("orderNotes/fetchOrderNotes", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-notes`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch order notes");
    }
});

export const fetchOrderNote = createAsyncThunk("orderNotes/fetchOrderNote", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-notes/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch order note");
    }
});

export const createOrderNote = createAsyncThunk("orderNotes/createOrderNote", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-notes`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create order note");
    }
});

export const updateOrderNote = createAsyncThunk("orderNotes/updateOrderNote", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-notes/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update order note");
    }
});

export const deleteOrderNote = createAsyncThunk("orderNotes/deleteOrderNote", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/order-notes/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete order note");
    }
});

const orderNotesSlice = createSlice({
    name: "orderNotes",
    initialState: {
        orderNotes: [],
        orderNote: null,
        orderNoteLoading: false,
        orderNoteError: null
    },
    reducers: {
        clearOrderNote(state) { state.orderNote = null; },
        clearOrderNoteError(state) { state.orderNoteError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchOrderNotes.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(fetchOrderNotes.fulfilled, (s, a) => {
                s.orderNoteLoading = false;
                if (Array.isArray(a.payload)) {
                    s.orderNotes = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.orderNotes = a.payload.data;
                } else {
                    s.orderNotes = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchOrderNotes.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; })

            .addCase(fetchOrderNote.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(fetchOrderNote.fulfilled, (s, a) => { s.orderNoteLoading = false; s.orderNote = a.payload?.data ?? a.payload; })
            .addCase(fetchOrderNote.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; })

            .addCase(createOrderNote.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(createOrderNote.fulfilled, (s, a) => {
                s.orderNoteLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.orderNotes.unshift(created);
            })
            .addCase(createOrderNote.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; })

            .addCase(updateOrderNote.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(updateOrderNote.fulfilled, (s, a) => {
                s.orderNoteLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.orderNotes = s.orderNotes.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.orderNote && (s.orderNote._id ?? s.orderNote.id) === id) s.orderNote = { ...s.orderNote, ...updated };
                }
            })
            .addCase(updateOrderNote.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; })

            .addCase(deleteOrderNote.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(deleteOrderNote.fulfilled, (s, a) => {
                s.orderNoteLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.orderNotes = s.orderNotes.filter(x => (x._id ?? x.id) !== id);
                    if (s.orderNote && (s.orderNote._id ?? s.orderNote.id) === id) s.orderNote = null;
                }
            })
            .addCase(deleteOrderNote.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; });
    }
});

export const { clearOrderNote, clearOrderNoteError } = orderNotesSlice.actions;
export const selectOrderNotes = state => state.orderNotes;
export default orderNotesSlice.reducer;
