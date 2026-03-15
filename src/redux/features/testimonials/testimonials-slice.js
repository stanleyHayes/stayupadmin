import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { testimonials as seedTestimonials } from "./testimonials";

let _testimonials = [...seedTestimonials];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._testimonials];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(t =>
                (t.name || "").toLowerCase().includes(q) ||
                (t.title || "").toLowerCase().includes(q) ||
                (t.content || "").toLowerCase().includes(q) ||
                (t.product || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(t => t.status === params.status);
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _testimonials.find(t => String(t._id) === String(id)) || null;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _testimonials = _testimonials.map(t => String(t._id) === String(id) ? { ...t, ...payload, _id: t._id } : t);
        return _testimonials.find(t => String(t._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _testimonials.find(t => String(t._id) === String(id));
        _testimonials = _testimonials.filter(t => String(t._id) !== String(id));
        return removed || null;
    }
};

export const fetchTestimonials = createAsyncThunk("testimonials/fetchTestimonials", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchTestimonial = createAsyncThunk("testimonials/fetchTestimonial", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateTestimonial = createAsyncThunk("testimonials/updateTestimonial", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteTestimonial = createAsyncThunk("testimonials/deleteTestimonial", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const testimonialsSlice = createSlice({
    name: "testimonials",
    initialState: {
        testimonials: [..._testimonials],
        testimonial: null,
        testimonialLoading: false,
        testimonialError: null
    },
    reducers: {
        clearTestimonial(state) { state.testimonial = null; },
        clearTestimonialError(state) { state.testimonialError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTestimonials.pending, s => { s.testimonialLoading = true; s.testimonialError = null; })
            .addCase(fetchTestimonials.fulfilled, (s, a) => { s.testimonialLoading = false; s.testimonials = a.payload; })
            .addCase(fetchTestimonials.rejected, (s, a) => { s.testimonialLoading = false; s.testimonialError = a.payload || a.error.message; })

            .addCase(fetchTestimonial.pending, s => { s.testimonialLoading = true; s.testimonialError = null; })
            .addCase(fetchTestimonial.fulfilled, (s, a) => { s.testimonialLoading = false; s.testimonial = a.payload; })
            .addCase(fetchTestimonial.rejected, (s, a) => { s.testimonialLoading = false; s.testimonialError = a.payload || a.error.message; })

            .addCase(updateTestimonial.pending, s => { s.testimonialLoading = true; s.testimonialError = null; })
            .addCase(updateTestimonial.fulfilled, (s, a) => {
                s.testimonialLoading = false;
                s.testimonials = s.testimonials.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.testimonial && String(s.testimonial._id) === String(a.payload._id)) s.testimonial = a.payload;
            })
            .addCase(updateTestimonial.rejected, (s, a) => { s.testimonialLoading = false; s.testimonialError = a.payload || a.error.message; })

            .addCase(deleteTestimonial.pending, s => { s.testimonialLoading = true; s.testimonialError = null; })
            .addCase(deleteTestimonial.fulfilled, (s, a) => {
                s.testimonialLoading = false;
                if (a.payload && a.payload._id) {
                    s.testimonials = s.testimonials.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.testimonial && String(s.testimonial._id) === String(a.payload._id)) s.testimonial = null;
                }
            })
            .addCase(deleteTestimonial.rejected, (s, a) => { s.testimonialLoading = false; s.testimonialError = a.payload || a.error.message; });
    }
});

export const { clearTestimonial, clearTestimonialError } = testimonialsSlice.actions;
export const selectTestimonials = state => state.testimonials;
export default testimonialsSlice.reducer;
