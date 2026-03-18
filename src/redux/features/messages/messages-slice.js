import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchMessages = createAsyncThunk("messages/fetchMessages", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/messages`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch messages");
    }
});

export const fetchMessage = createAsyncThunk("messages/fetchMessage", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/messages/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch message");
    }
});

export const deleteMessage = createAsyncThunk("messages/deleteMessage", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/messages/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete message");
    }
});

const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        messages: [],
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
            .addCase(fetchMessages.fulfilled, (s, a) => {
                s.messageLoading = false;
                if (Array.isArray(a.payload)) {
                    s.messages = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.messages = a.payload.data;
                } else {
                    s.messages = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchMessages.rejected, (s, a) => { s.messageLoading = false; s.messageError = a.payload || a.error.message; })

            .addCase(fetchMessage.pending, s => { s.messageLoading = true; s.messageError = null; })
            .addCase(fetchMessage.fulfilled, (s, a) => { s.messageLoading = false; s.message = a.payload?.data ?? a.payload; })
            .addCase(fetchMessage.rejected, (s, a) => { s.messageLoading = false; s.messageError = a.payload || a.error.message; })

            .addCase(deleteMessage.pending, s => { s.messageLoading = true; s.messageError = null; })
            .addCase(deleteMessage.fulfilled, (s, a) => {
                s.messageLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.messages = s.messages.filter(x => (x._id ?? x.id) !== id);
                    if (s.message && (s.message._id ?? s.message.id) === id) s.message = null;
                }
            })
            .addCase(deleteMessage.rejected, (s, a) => { s.messageLoading = false; s.messageError = a.payload || a.error.message; });
    }
});

export const { clearMessage, clearMessageError } = messagesSlice.actions;
export const selectMessages = state => state.messages;
export default messagesSlice.reducer;
