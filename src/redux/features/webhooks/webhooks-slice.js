import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { webhooks as seedWebhooks } from "./webhooks";

let _webhooks = [...seedWebhooks];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._webhooks];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(w =>
                (w.name || "").toLowerCase().includes(q) ||
                (w.topic || "").toLowerCase().includes(q) ||
                (w.delivery_url || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(w => w.status === params.status);
        }
        if (params.topic) {
            res = res.filter(w => w.topic === params.topic);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _webhooks.find(w => String(w._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `wh${Date.now()}`;
        const newWebhook = { _id, status: "active", date_created: new Date().toISOString(), ...payload };
        _webhooks = [newWebhook, ..._webhooks];
        return newWebhook;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _webhooks = _webhooks.map(w => String(w._id) === String(id) ? { ...w, ...payload, _id: w._id } : w);
        return _webhooks.find(w => String(w._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _webhooks.find(w => String(w._id) === String(id));
        _webhooks = _webhooks.filter(w => String(w._id) !== String(id));
        return removed || null;
    }
};

export const fetchWebhooks = createAsyncThunk("webhooks/fetchWebhooks", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchWebhook = createAsyncThunk("webhooks/fetchWebhook", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createWebhook = createAsyncThunk("webhooks/createWebhook", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateWebhook = createAsyncThunk("webhooks/updateWebhook", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteWebhook = createAsyncThunk("webhooks/deleteWebhook", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const webhooksSlice = createSlice({
    name: "webhooks",
    initialState: {
        webhooks: [..._webhooks],
        webhook: null,
        webhookLoading: false,
        webhookError: null
    },
    reducers: {
        clearWebhook(state) { state.webhook = null; },
        clearWebhookError(state) { state.webhookError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchWebhooks.pending, s => { s.webhookLoading = true; s.webhookError = null; })
            .addCase(fetchWebhooks.fulfilled, (s, a) => { s.webhookLoading = false; s.webhooks = a.payload; })
            .addCase(fetchWebhooks.rejected, (s, a) => { s.webhookLoading = false; s.webhookError = a.payload || a.error.message; })

            .addCase(fetchWebhook.pending, s => { s.webhookLoading = true; s.webhookError = null; })
            .addCase(fetchWebhook.fulfilled, (s, a) => { s.webhookLoading = false; s.webhook = a.payload; })
            .addCase(fetchWebhook.rejected, (s, a) => { s.webhookLoading = false; s.webhookError = a.payload || a.error.message; })

            .addCase(createWebhook.pending, s => { s.webhookLoading = true; s.webhookError = null; })
            .addCase(createWebhook.fulfilled, (s, a) => { s.webhookLoading = false; s.webhooks.unshift(a.payload); })
            .addCase(createWebhook.rejected, (s, a) => { s.webhookLoading = false; s.webhookError = a.payload || a.error.message; })

            .addCase(updateWebhook.pending, s => { s.webhookLoading = true; s.webhookError = null; })
            .addCase(updateWebhook.fulfilled, (s, a) => {
                s.webhookLoading = false;
                s.webhooks = s.webhooks.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.webhook && String(s.webhook._id) === String(a.payload._id)) s.webhook = a.payload;
            })
            .addCase(updateWebhook.rejected, (s, a) => { s.webhookLoading = false; s.webhookError = a.payload || a.error.message; })

            .addCase(deleteWebhook.pending, s => { s.webhookLoading = true; s.webhookError = null; })
            .addCase(deleteWebhook.fulfilled, (s, a) => {
                s.webhookLoading = false;
                if (a.payload && a.payload._id) {
                    s.webhooks = s.webhooks.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.webhook && String(s.webhook._id) === String(a.payload._id)) s.webhook = null;
                }
            })
            .addCase(deleteWebhook.rejected, (s, a) => { s.webhookLoading = false; s.webhookError = a.payload || a.error.message; });
    }
});

export const { clearWebhook, clearWebhookError } = webhooksSlice.actions;
export const selectWebhooks = state => state.webhooks;
export default webhooksSlice.reducer;
