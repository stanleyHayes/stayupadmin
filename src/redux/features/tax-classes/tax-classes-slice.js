import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taxClasses as seedTaxClasses } from "./tax-classes";

let _taxClasses = [...seedTaxClasses];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._taxClasses];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(t =>
                (t.name || "").toLowerCase().includes(q) ||
                (t.slug || "").toLowerCase().includes(q)
            );
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _taxClasses.find(t => String(t._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `tc${Date.now()}`;
        const newClass = { _id, created_at: new Date().toISOString(), ...payload };
        _taxClasses = [newClass, ..._taxClasses];
        return newClass;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _taxClasses = _taxClasses.map(t => String(t._id) === String(id) ? { ...t, ...payload, _id: t._id } : t);
        return _taxClasses.find(t => String(t._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _taxClasses.find(t => String(t._id) === String(id));
        _taxClasses = _taxClasses.filter(t => String(t._id) !== String(id));
        return removed || null;
    }
};

export const fetchTaxClasses = createAsyncThunk("taxClasses/fetchTaxClasses", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchTaxClass = createAsyncThunk("taxClasses/fetchTaxClass", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createTaxClass = createAsyncThunk("taxClasses/createTaxClass", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateTaxClass = createAsyncThunk("taxClasses/updateTaxClass", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteTaxClass = createAsyncThunk("taxClasses/deleteTaxClass", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const taxClassesSlice = createSlice({
    name: "taxClasses",
    initialState: {
        taxClasses: [..._taxClasses],
        taxClass: null,
        taxClassLoading: false,
        taxClassError: null
    },
    reducers: {
        clearTaxClass(state) { state.taxClass = null; },
        clearTaxClassError(state) { state.taxClassError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTaxClasses.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(fetchTaxClasses.fulfilled, (s, a) => { s.taxClassLoading = false; s.taxClasses = a.payload; })
            .addCase(fetchTaxClasses.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; })

            .addCase(fetchTaxClass.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(fetchTaxClass.fulfilled, (s, a) => { s.taxClassLoading = false; s.taxClass = a.payload; })
            .addCase(fetchTaxClass.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; })

            .addCase(createTaxClass.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(createTaxClass.fulfilled, (s, a) => { s.taxClassLoading = false; s.taxClasses.unshift(a.payload); })
            .addCase(createTaxClass.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; })

            .addCase(updateTaxClass.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(updateTaxClass.fulfilled, (s, a) => {
                s.taxClassLoading = false;
                s.taxClasses = s.taxClasses.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.taxClass && String(s.taxClass._id) === String(a.payload._id)) s.taxClass = a.payload;
            })
            .addCase(updateTaxClass.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; })

            .addCase(deleteTaxClass.pending, s => { s.taxClassLoading = true; s.taxClassError = null; })
            .addCase(deleteTaxClass.fulfilled, (s, a) => {
                s.taxClassLoading = false;
                if (a.payload && a.payload._id) {
                    s.taxClasses = s.taxClasses.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.taxClass && String(s.taxClass._id) === String(a.payload._id)) s.taxClass = null;
                }
            })
            .addCase(deleteTaxClass.rejected, (s, a) => { s.taxClassLoading = false; s.taxClassError = a.payload || a.error.message; });
    }
});

export const { clearTaxClass, clearTaxClassError } = taxClassesSlice.actions;
export const selectTaxClasses = state => state.taxClasses;
export default taxClassesSlice.reducer;
