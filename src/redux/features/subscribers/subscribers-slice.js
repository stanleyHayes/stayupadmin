import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscribers as seedSubscribers } from "./subscribers";

let _subscribers = [...seedSubscribers];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._subscribers];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(s => (s.email || "").toLowerCase().includes(q));
        }
        if (params.status && params.status !== "all") {
            res = res.filter(s => s.status === params.status);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _subscribers.find(s => String(s._id) === String(id)) || null;
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _subscribers.find(s => String(s._id) === String(id));
        _subscribers = _subscribers.filter(s => String(s._id) !== String(id));
        return removed || null;
    }
};

export const fetchSubscribers = createAsyncThunk("subscribers/fetchSubscribers", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchSubscriber = createAsyncThunk("subscribers/fetchSubscriber", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteSubscriber = createAsyncThunk("subscribers/deleteSubscriber", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const subscribersSlice = createSlice({
    name: "subscribers",
    initialState: {
        subscribers: [..._subscribers],
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
            .addCase(fetchSubscribers.fulfilled, (s, a) => { s.subscriberLoading = false; s.subscribers = a.payload; })
            .addCase(fetchSubscribers.rejected, (s, a) => { s.subscriberLoading = false; s.subscriberError = a.payload || a.error.message; })

            .addCase(fetchSubscriber.pending, s => { s.subscriberLoading = true; s.subscriberError = null; })
            .addCase(fetchSubscriber.fulfilled, (s, a) => { s.subscriberLoading = false; s.subscriber = a.payload; })
            .addCase(fetchSubscriber.rejected, (s, a) => { s.subscriberLoading = false; s.subscriberError = a.payload || a.error.message; })

            .addCase(deleteSubscriber.pending, s => { s.subscriberLoading = true; s.subscriberError = null; })
            .addCase(deleteSubscriber.fulfilled, (s, a) => {
                s.subscriberLoading = false;
                if (a.payload && a.payload._id) {
                    s.subscribers = s.subscribers.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.subscriber && String(s.subscriber._id) === String(a.payload._id)) s.subscriber = null;
                }
            })
            .addCase(deleteSubscriber.rejected, (s, a) => { s.subscriberLoading = false; s.subscriberError = a.payload || a.error.message; });
    }
});

export const { clearSubscriber, clearSubscriberError } = subscribersSlice.actions;
export const selectSubscribers = state => state.subscribers;
export default subscribersSlice.reducer;
