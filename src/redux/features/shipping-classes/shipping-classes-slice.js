import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { shippingClasses as seedShippingClasses } from "./shipping-classes";

let _shippingClasses = [...seedShippingClasses];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._shippingClasses];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(c =>
                (c.name || "").toLowerCase().includes(q) ||
                (c.slug || "").toLowerCase().includes(q) ||
                (c.description || "").toLowerCase().includes(q)
            );
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _shippingClasses.find(c => String(c._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `sc${Date.now()}`;
        const newClass = { _id, count: 0, created_at: new Date().toISOString(), ...payload };
        _shippingClasses = [newClass, ..._shippingClasses];
        return newClass;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _shippingClasses = _shippingClasses.map(c => String(c._id) === String(id) ? { ...c, ...payload, _id: c._id } : c);
        return _shippingClasses.find(c => String(c._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _shippingClasses.find(c => String(c._id) === String(id));
        _shippingClasses = _shippingClasses.filter(c => String(c._id) !== String(id));
        return removed || null;
    }
};

export const fetchShippingClasses = createAsyncThunk("shippingClasses/fetchShippingClasses", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchShippingClass = createAsyncThunk("shippingClasses/fetchShippingClass", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createShippingClass = createAsyncThunk("shippingClasses/createShippingClass", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateShippingClass = createAsyncThunk("shippingClasses/updateShippingClass", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteShippingClass = createAsyncThunk("shippingClasses/deleteShippingClass", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const shippingClassesSlice = createSlice({
    name: "shippingClasses",
    initialState: {
        shippingClasses: [..._shippingClasses],
        shippingClass: null,
        shippingClassLoading: false,
        shippingClassError: null
    },
    reducers: {
        clearShippingClass(state) { state.shippingClass = null; },
        clearShippingClassError(state) { state.shippingClassError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchShippingClasses.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(fetchShippingClasses.fulfilled, (s, a) => { s.shippingClassLoading = false; s.shippingClasses = a.payload; })
            .addCase(fetchShippingClasses.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; })

            .addCase(fetchShippingClass.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(fetchShippingClass.fulfilled, (s, a) => { s.shippingClassLoading = false; s.shippingClass = a.payload; })
            .addCase(fetchShippingClass.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; })

            .addCase(createShippingClass.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(createShippingClass.fulfilled, (s, a) => { s.shippingClassLoading = false; s.shippingClasses.unshift(a.payload); })
            .addCase(createShippingClass.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; })

            .addCase(updateShippingClass.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(updateShippingClass.fulfilled, (s, a) => {
                s.shippingClassLoading = false;
                s.shippingClasses = s.shippingClasses.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.shippingClass && String(s.shippingClass._id) === String(a.payload._id)) s.shippingClass = a.payload;
            })
            .addCase(updateShippingClass.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; })

            .addCase(deleteShippingClass.pending, s => { s.shippingClassLoading = true; s.shippingClassError = null; })
            .addCase(deleteShippingClass.fulfilled, (s, a) => {
                s.shippingClassLoading = false;
                if (a.payload && a.payload._id) {
                    s.shippingClasses = s.shippingClasses.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.shippingClass && String(s.shippingClass._id) === String(a.payload._id)) s.shippingClass = null;
                }
            })
            .addCase(deleteShippingClass.rejected, (s, a) => { s.shippingClassLoading = false; s.shippingClassError = a.payload || a.error.message; });
    }
});

export const { clearShippingClass, clearShippingClassError } = shippingClassesSlice.actions;
export const selectShippingClasses = state => state.shippingClasses;
export default shippingClassesSlice.reducer;
