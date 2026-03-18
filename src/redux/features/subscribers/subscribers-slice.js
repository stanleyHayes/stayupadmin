import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchSubscribers = createAsyncThunk("subscribers/fetchSubscribers", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/subscribers`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch subscribers");
    }
});

export const fetchSubscriber = createAsyncThunk("subscribers/fetchSubscriber", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/subscribers/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch subscriber");
    }
});

export const deleteSubscriber = createAsyncThunk("subscribers/deleteSubscriber", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/subscribers/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete subscriber");
    }
});

const subscribersSlice = createSlice({
    name: "subscribers",
    initialState: {
        subscribers: [],
        subscriber: null,
        subscriberLoading: false,
        subscriberError: null
    },
    reducers: {
        clearSubscriber(state) { state.subscriber = null; },
        clearSubscriberError(state) { state.subscriberError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSubscribers.pending, s => { s.subscriberLoading = true; s.subscriberError = null; })
            .addCase(fetchSubscribers.fulfilled, (s, a) => {
                s.subscriberLoading = false;
                if (Array.isArray(a.payload)) {
                    s.subscribers = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.subscribers = a.payload.data;
                } else {
                    s.subscribers = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchSubscribers.rejected, (s, a) => { s.subscriberLoading = false; s.subscriberError = a.payload || a.error.message; })

            .addCase(fetchSubscriber.pending, s => { s.subscriberLoading = true; s.subscriberError = null; })
            .addCase(fetchSubscriber.fulfilled, (s, a) => { s.subscriberLoading = false; s.subscriber = a.payload?.data ?? a.payload; })
            .addCase(fetchSubscriber.rejected, (s, a) => { s.subscriberLoading = false; s.subscriberError = a.payload || a.error.message; })

            .addCase(deleteSubscriber.pending, s => { s.subscriberLoading = true; s.subscriberError = null; })
            .addCase(deleteSubscriber.fulfilled, (s, a) => {
                s.subscriberLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.subscribers = s.subscribers.filter(x => (x._id ?? x.id) !== id);
                    if (s.subscriber && (s.subscriber._id ?? s.subscriber.id) === id) s.subscriber = null;
                }
            })
            .addCase(deleteSubscriber.rejected, (s, a) => { s.subscriberLoading = false; s.subscriberError = a.payload || a.error.message; });
    }
});

export const { clearSubscriber, clearSubscriberError } = subscribersSlice.actions;
export const selectSubscribers = state => state.subscribers;
export default subscribersSlice.reducer;
