import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchTestimonials = createAsyncThunk("testimonials/fetchTestimonials", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/testimonials`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch testimonials");
    }
});

export const fetchTestimonial = createAsyncThunk("testimonials/fetchTestimonial", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/testimonials/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch testimonial");
    }
});

export const updateTestimonial = createAsyncThunk("testimonials/updateTestimonial", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/testimonials/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update testimonial");
    }
});

export const deleteTestimonial = createAsyncThunk("testimonials/deleteTestimonial", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/testimonials/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete testimonial");
    }
});

const testimonialsSlice = createSlice({
    name: "testimonials",
    initialState: {
        testimonials: [],
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
            .addCase(fetchTestimonials.fulfilled, (s, a) => {
                s.testimonialLoading = false;
                if (Array.isArray(a.payload)) {
                    s.testimonials = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.testimonials = a.payload.data;
                } else {
                    s.testimonials = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchTestimonials.rejected, (s, a) => { s.testimonialLoading = false; s.testimonialError = a.payload || a.error.message; })

            .addCase(fetchTestimonial.pending, s => { s.testimonialLoading = true; s.testimonialError = null; })
            .addCase(fetchTestimonial.fulfilled, (s, a) => { s.testimonialLoading = false; s.testimonial = a.payload?.data ?? a.payload; })
            .addCase(fetchTestimonial.rejected, (s, a) => { s.testimonialLoading = false; s.testimonialError = a.payload || a.error.message; })

            .addCase(updateTestimonial.pending, s => { s.testimonialLoading = true; s.testimonialError = null; })
            .addCase(updateTestimonial.fulfilled, (s, a) => {
                s.testimonialLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.testimonials = s.testimonials.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.testimonial && (s.testimonial._id ?? s.testimonial.id) === id) s.testimonial = { ...s.testimonial, ...updated };
                }
            })
            .addCase(updateTestimonial.rejected, (s, a) => { s.testimonialLoading = false; s.testimonialError = a.payload || a.error.message; })

            .addCase(deleteTestimonial.pending, s => { s.testimonialLoading = true; s.testimonialError = null; })
            .addCase(deleteTestimonial.fulfilled, (s, a) => {
                s.testimonialLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.testimonials = s.testimonials.filter(x => (x._id ?? x.id) !== id);
                    if (s.testimonial && (s.testimonial._id ?? s.testimonial.id) === id) s.testimonial = null;
                }
            })
            .addCase(deleteTestimonial.rejected, (s, a) => { s.testimonialLoading = false; s.testimonialError = a.payload || a.error.message; });
    }
});

export const { clearTestimonial, clearTestimonialError } = testimonialsSlice.actions;
export const selectTestimonials = state => state.testimonials;
export default testimonialsSlice.reducer;
