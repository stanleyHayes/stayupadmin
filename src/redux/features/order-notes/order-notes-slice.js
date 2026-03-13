import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderNotes as seedOrderNotes } from "./order-notes";

let _orderNotes = [...seedOrderNotes];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._orderNotes];
        if (params.order_id) {
            res = res.filter(n => String(n.order_id) === String(params.order_id));
        }
        if (params.note_type) {
            res = res.filter(n => n.note_type === params.note_type);
        }
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(n =>
                (n.content || "").toLowerCase().includes(q) ||
                (n.author || "").toLowerCase().includes(q)
            );
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _orderNotes.find(n => String(n._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `on${Date.now()}`;
        const newNote = { _id, created_at: new Date().toISOString(), ...payload };
        _orderNotes = [newNote, ..._orderNotes];
        return newNote;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _orderNotes = _orderNotes.map(n => String(n._id) === String(id) ? { ...n, ...payload, _id: n._id } : n);
        return _orderNotes.find(n => String(n._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _orderNotes.find(n => String(n._id) === String(id));
        _orderNotes = _orderNotes.filter(n => String(n._id) !== String(id));
        return removed || null;
    }
};

export const fetchOrderNotes = createAsyncThunk("orderNotes/fetchOrderNotes", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchOrderNote = createAsyncThunk("orderNotes/fetchOrderNote", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createOrderNote = createAsyncThunk("orderNotes/createOrderNote", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateOrderNote = createAsyncThunk("orderNotes/updateOrderNote", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteOrderNote = createAsyncThunk("orderNotes/deleteOrderNote", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const orderNotesSlice = createSlice({
    name: "orderNotes",
    initialState: {
        orderNotes: [..._orderNotes],
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
            .addCase(fetchOrderNotes.fulfilled, (s, a) => { s.orderNoteLoading = false; s.orderNotes = a.payload; })
            .addCase(fetchOrderNotes.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; })

            .addCase(fetchOrderNote.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(fetchOrderNote.fulfilled, (s, a) => { s.orderNoteLoading = false; s.orderNote = a.payload; })
            .addCase(fetchOrderNote.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; })

            .addCase(createOrderNote.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(createOrderNote.fulfilled, (s, a) => { s.orderNoteLoading = false; s.orderNotes.unshift(a.payload); })
            .addCase(createOrderNote.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; })

            .addCase(updateOrderNote.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(updateOrderNote.fulfilled, (s, a) => {
                s.orderNoteLoading = false;
                s.orderNotes = s.orderNotes.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.orderNote && String(s.orderNote._id) === String(a.payload._id)) s.orderNote = a.payload;
            })
            .addCase(updateOrderNote.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; })

            .addCase(deleteOrderNote.pending, s => { s.orderNoteLoading = true; s.orderNoteError = null; })
            .addCase(deleteOrderNote.fulfilled, (s, a) => {
                s.orderNoteLoading = false;
                if (a.payload && a.payload._id) {
                    s.orderNotes = s.orderNotes.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.orderNote && String(s.orderNote._id) === String(a.payload._id)) s.orderNote = null;
                }
            })
            .addCase(deleteOrderNote.rejected, (s, a) => { s.orderNoteLoading = false; s.orderNoteError = a.payload || a.error.message; });
    }
});

export const { clearOrderNote, clearOrderNoteError } = orderNotesSlice.actions;
export const selectOrderNotes = state => state.orderNotes;
export default orderNotesSlice.reducer;
