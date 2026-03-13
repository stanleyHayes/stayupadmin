import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taxRates as seedTaxRates } from "./tax-rates";

let _taxRates = [...seedTaxRates];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._taxRates];
        if (params.country) {
            res = res.filter(t => t.country === params.country);
        }
        if (params.tax_class) {
            res = res.filter(t => t.tax_class === params.tax_class);
        }
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(t =>
                (t.name || "").toLowerCase().includes(q) ||
                (t.country || "").toLowerCase().includes(q) ||
                (t.state || "").toLowerCase().includes(q) ||
                (t.city || "").toLowerCase().includes(q)
            );
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _taxRates.find(t => String(t._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `tr${Date.now()}`;
        const newRate = { _id, created_at: new Date().toISOString(), ...payload };
        _taxRates = [newRate, ..._taxRates];
        return newRate;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _taxRates = _taxRates.map(t => String(t._id) === String(id) ? { ...t, ...payload, _id: t._id } : t);
        return _taxRates.find(t => String(t._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _taxRates.find(t => String(t._id) === String(id));
        _taxRates = _taxRates.filter(t => String(t._id) !== String(id));
        return removed || null;
    }
};

export const fetchTaxRates = createAsyncThunk("taxRates/fetchTaxRates", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchTaxRate = createAsyncThunk("taxRates/fetchTaxRate", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createTaxRate = createAsyncThunk("taxRates/createTaxRate", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateTaxRate = createAsyncThunk("taxRates/updateTaxRate", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteTaxRate = createAsyncThunk("taxRates/deleteTaxRate", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const taxRatesSlice = createSlice({
    name: "taxRates",
    initialState: {
        taxRates: [..._taxRates],
        taxRate: null,
        taxRateLoading: false,
        taxRateError: null
    },
    reducers: {
        clearTaxRate(state) { state.taxRate = null; },
        clearTaxRateError(state) { state.taxRateError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTaxRates.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(fetchTaxRates.fulfilled, (s, a) => { s.taxRateLoading = false; s.taxRates = a.payload; })
            .addCase(fetchTaxRates.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; })

            .addCase(fetchTaxRate.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(fetchTaxRate.fulfilled, (s, a) => { s.taxRateLoading = false; s.taxRate = a.payload; })
            .addCase(fetchTaxRate.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; })

            .addCase(createTaxRate.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(createTaxRate.fulfilled, (s, a) => { s.taxRateLoading = false; s.taxRates.unshift(a.payload); })
            .addCase(createTaxRate.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; })

            .addCase(updateTaxRate.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(updateTaxRate.fulfilled, (s, a) => {
                s.taxRateLoading = false;
                s.taxRates = s.taxRates.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.taxRate && String(s.taxRate._id) === String(a.payload._id)) s.taxRate = a.payload;
            })
            .addCase(updateTaxRate.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; })

            .addCase(deleteTaxRate.pending, s => { s.taxRateLoading = true; s.taxRateError = null; })
            .addCase(deleteTaxRate.fulfilled, (s, a) => {
                s.taxRateLoading = false;
                if (a.payload && a.payload._id) {
                    s.taxRates = s.taxRates.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.taxRate && String(s.taxRate._id) === String(a.payload._id)) s.taxRate = null;
                }
            })
            .addCase(deleteTaxRate.rejected, (s, a) => { s.taxRateLoading = false; s.taxRateError = a.payload || a.error.message; });
    }
});

export const { clearTaxRate, clearTaxRateError } = taxRatesSlice.actions;
export const selectTaxRates = state => state.taxRates;
export default taxRatesSlice.reducer;
