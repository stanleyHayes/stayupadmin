import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { messages as seedMessages } from "./messages";

let _messages = [...seedMessages];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._messages];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(m =>
                (m.name || "").toLowerCase().includes(q) ||
                (m.email || "").toLowerCase().includes(q) ||
                (m.subject || "").toLowerCase().includes(q) ||
                (m.message || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(m => m.status === params.status);
        }
        if (params.subject && params.subject !== "all") {
            res = res.filter(m => m.subject === params.subject);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        const msg = _messages.find(m => String(m._id) === String(id));
        if (msg && msg.status === "unread") {
            msg.status = "read";
            _messages = _messages.map(m => String(m._id) === String(id) ? { ...m, status: "read" } : m);
        }
        return msg || null;
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _messages.find(m => String(m._id) === String(id));
        _messages = _messages.filter(m => String(m._id) !== String(id));
        return removed || null;
    }
};

export const fetchMessages = createAsyncThunk("messages/fetchMessages", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchMessage = createAsyncThunk("messages/fetchMessage", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteMessage = createAsyncThunk("messages/deleteMessage", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        messages: [..._messages],
        message: null,
        messageLoading: false,
        messageError: null
    },
    reducers: {
        clearMessage(state) { state.message = null; },
        clearMessageError(state) { state.messageError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMessages.pending, s => { s.messageLoading = true; s.messageError = null; })
            .addCase(fetchMessages.fulfilled, (s, a) => { s.messageLoading = false; s.messages = a.payload; })
            .addCase(fetchMessages.rejected, (s, a) => { s.messageLoading = false; s.messageError = a.payload || a.error.message; })

            .addCase(fetchMessage.pending, s => { s.messageLoading = true; s.messageError = null; })
            .addCase(fetchMessage.fulfilled, (s, a) => { s.messageLoading = false; s.message = a.payload; })
            .addCase(fetchMessage.rejected, (s, a) => { s.messageLoading = false; s.messageError = a.payload || a.error.message; })

            .addCase(deleteMessage.pending, s => { s.messageLoading = true; s.messageError = null; })
            .addCase(deleteMessage.fulfilled, (s, a) => {
                s.messageLoading = false;
                if (a.payload && a.payload._id) {
                    s.messages = s.messages.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.message && String(s.message._id) === String(a.payload._id)) s.message = null;
                }
            })
            .addCase(deleteMessage.rejected, (s, a) => { s.messageLoading = false; s.messageError = a.payload || a.error.message; });
    }
});

export const { clearMessage, clearMessageError } = messagesSlice.actions;
export const selectMessages = state => state.messages;
export default messagesSlice.reducer;
