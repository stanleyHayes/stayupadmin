import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchReviews = createAsyncThunk("reviews/fetchReviews", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/reviews`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch reviews");
    }
});

export const fetchReview = createAsyncThunk("reviews/fetchReview", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/reviews/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch review");
    }
});

export const createReview = createAsyncThunk("reviews/createReview", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/reviews`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create review");
    }
});

export const updateReview = createAsyncThunk("reviews/updateReview", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/reviews/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update review");
    }
});

export const deleteReview = createAsyncThunk("reviews/deleteReview", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/reviews/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete review");
    }
});

const reviewsSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [],
        review: null,
        reviewLoading: false,
        reviewError: null
    },
    reducers: {
        clearReview(state) { state.review = null; },
        clearReviewError(state) { state.reviewError = null; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchReviews.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(fetchReviews.fulfilled, (s, a) => {
                s.reviewLoading = false;
                if (Array.isArray(a.payload)) {
                    s.reviews = a.payload;
                } else if (a.payload && Array.isArray(a.payload.data)) {
                    s.reviews = a.payload.data;
                } else {
                    s.reviews = a.payload ? [a.payload] : [];
                }
            })
            .addCase(fetchReviews.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; })

            .addCase(fetchReview.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(fetchReview.fulfilled, (s, a) => { s.reviewLoading = false; s.review = a.payload?.data ?? a.payload; })
            .addCase(fetchReview.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; })

            .addCase(createReview.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(createReview.fulfilled, (s, a) => {
                s.reviewLoading = false;
                const created = a.payload?.data ?? a.payload;
                if (created) s.reviews.unshift(created);
            })
            .addCase(createReview.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; })

            .addCase(updateReview.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(updateReview.fulfilled, (s, a) => {
                s.reviewLoading = false;
                const updated = a.payload?.data ?? a.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    s.reviews = s.reviews.map(x => (x._id ?? x.id) === id ? { ...x, ...updated } : x);
                    if (s.review && (s.review._id ?? s.review.id) === id) s.review = { ...s.review, ...updated };
                }
            })
            .addCase(updateReview.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; })

            .addCase(deleteReview.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(deleteReview.fulfilled, (s, a) => {
                s.reviewLoading = false;
                const id = a.payload?.id;
                if (id) {
                    s.reviews = s.reviews.filter(x => (x._id ?? x.id) !== id);
                    if (s.review && (s.review._id ?? s.review.id) === id) s.review = null;
                }
            })
            .addCase(deleteReview.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; });
    }
});

export const { clearReview, clearReviewError } = reviewsSlice.actions;
export const selectReviews = state => state.reviews;
export default reviewsSlice.reducer;
