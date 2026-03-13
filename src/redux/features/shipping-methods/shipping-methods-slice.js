import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { shippingMethods as seedShippingMethods } from "./shipping-methods";

let _shippingMethods = [...seedShippingMethods];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._shippingMethods];
        if (params.enabled !== undefined) {
            res = res.filter(m => m.enabled === params.enabled);
        }
        if (params.method_id) {
            res = res.filter(m => m.method_id === params.method_id);
        }
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(m =>
                (m.title || "").toLowerCase().includes(q) ||
                (m.description || "").toLowerCase().includes(q)
            );
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _shippingMethods.find(m => String(m._id) === String(id)) || null;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _shippingMethods = _shippingMethods.map(m => String(m._id) === String(id) ? { ...m, ...payload, _id: m._id } : m);
        return _shippingMethods.find(m => String(m._id) === String(id));
    }
};

export const fetchShippingMethods = createAsyncThunk("shippingMethods/fetchShippingMethods", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchShippingMethod = createAsyncThunk("shippingMethods/fetchShippingMethod", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateShippingMethod = createAsyncThunk("shippingMethods/updateShippingMethod", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

const shippingMethodsSlice = createSlice({
    name: "shippingMethods",
    initialState: {
        shippingMethods: [..._shippingMethods],
        shippingMethod: null,
        shippingMethodLoading: false,
        shippingMethodError: null
    },
    reducers: {
        clearShippingMethod(state) { state.shippingMethod = null; },
        clearShippingMethodError(state) { state.shippingMethodError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchShippingMethods.pending, s => { s.shippingMethodLoading = true; s.shippingMethodError = null; })
            .addCase(fetchShippingMethods.fulfilled, (s, a) => { s.shippingMethodLoading = false; s.shippingMethods = a.payload; })
            .addCase(fetchShippingMethods.rejected, (s, a) => { s.shippingMethodLoading = false; s.shippingMethodError = a.payload || a.error.message; })

            .addCase(fetchShippingMethod.pending, s => { s.shippingMethodLoading = true; s.shippingMethodError = null; })
            .addCase(fetchShippingMethod.fulfilled, (s, a) => { s.shippingMethodLoading = false; s.shippingMethod = a.payload; })
            .addCase(fetchShippingMethod.rejected, (s, a) => { s.shippingMethodLoading = false; s.shippingMethodError = a.payload || a.error.message; })

            .addCase(updateShippingMethod.pending, s => { s.shippingMethodLoading = true; s.shippingMethodError = null; })
            .addCase(updateShippingMethod.fulfilled, (s, a) => {
                s.shippingMethodLoading = false;
                s.shippingMethods = s.shippingMethods.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.shippingMethod && String(s.shippingMethod._id) === String(a.payload._id)) s.shippingMethod = a.payload;
            })
            .addCase(updateShippingMethod.rejected, (s, a) => { s.shippingMethodLoading = false; s.shippingMethodError = a.payload || a.error.message; });
    }
});

export const { clearShippingMethod, clearShippingMethodError } = shippingMethodsSlice.actions;
export const selectShippingMethods = state => state.shippingMethods;
export default shippingMethodsSlice.reducer;
