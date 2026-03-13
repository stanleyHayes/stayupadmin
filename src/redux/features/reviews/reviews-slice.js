import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviews as seedReviews } from "./reviews";

let _reviews = [...seedReviews];

const fakeApi = {
    list: async (params = {}) => {
        await new Promise(r => setTimeout(r, 80));
        let res = [..._reviews];
        if (params.search) {
            const q = params.search.toLowerCase();
            res = res.filter(r =>
                (r.reviewer || "").toLowerCase().includes(q) ||
                (r.reviewer_email || "").toLowerCase().includes(q) ||
                (r.review || "").toLowerCase().includes(q) ||
                (r.product_name || "").toLowerCase().includes(q)
            );
        }
        if (params.status && params.status !== "all") {
            res = res.filter(r => r.status === params.status);
        }
        if (params.product_id) {
            res = res.filter(r => String(r.product_id) === String(params.product_id));
        }
        return res;
    },
    get: async (id) => {
        await new Promise(r => setTimeout(r, 60));
        return _reviews.find(r => String(r._id) === String(id)) || null;
    },
    create: async (payload) => {
        await new Promise(r => setTimeout(r, 80));
        const _id = `rev${Date.now()}`;
        const newReview = { _id, status: "pending", verified: false, created_at: new Date().toISOString(), ...payload };
        _reviews = [newReview, ..._reviews];
        return newReview;
    },
    update: async (id, payload) => {
        await new Promise(r => setTimeout(r, 80));
        _reviews = _reviews.map(r => String(r._id) === String(id) ? { ...r, ...payload, _id: r._id } : r);
        return _reviews.find(r => String(r._id) === String(id));
    },
    remove: async (id) => {
        await new Promise(r => setTimeout(r, 80));
        const removed = _reviews.find(r => String(r._id) === String(id));
        _reviews = _reviews.filter(r => String(r._id) !== String(id));
        return removed || null;
    }
};

export const fetchReviews = createAsyncThunk("reviews/fetchReviews", async (params, { rejectWithValue }) => {
    try { return await fakeApi.list(params); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const fetchReview = createAsyncThunk("reviews/fetchReview", async (id, { rejectWithValue }) => {
    try { return await fakeApi.get(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const createReview = createAsyncThunk("reviews/createReview", async (payload, { rejectWithValue }) => {
    try { return await fakeApi.create(payload); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const updateReview = createAsyncThunk("reviews/updateReview", async ({ id, data }, { rejectWithValue }) => {
    try { return await fakeApi.update(id, data); }
    catch (e) { return rejectWithValue(String(e)); }
});

export const deleteReview = createAsyncThunk("reviews/deleteReview", async (id, { rejectWithValue }) => {
    try { return await fakeApi.remove(id); }
    catch (e) { return rejectWithValue(String(e)); }
});

const reviewsSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [..._reviews],
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
            .addCase(fetchReviews.fulfilled, (s, a) => { s.reviewLoading = false; s.reviews = a.payload; })
            .addCase(fetchReviews.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; })

            .addCase(fetchReview.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(fetchReview.fulfilled, (s, a) => { s.reviewLoading = false; s.review = a.payload; })
            .addCase(fetchReview.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; })

            .addCase(createReview.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(createReview.fulfilled, (s, a) => { s.reviewLoading = false; s.reviews.unshift(a.payload); })
            .addCase(createReview.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; })

            .addCase(updateReview.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(updateReview.fulfilled, (s, a) => {
                s.reviewLoading = false;
                s.reviews = s.reviews.map(x => String(x._id) === String(a.payload._id) ? a.payload : x);
                if (s.review && String(s.review._id) === String(a.payload._id)) s.review = a.payload;
            })
            .addCase(updateReview.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; })

            .addCase(deleteReview.pending, s => { s.reviewLoading = true; s.reviewError = null; })
            .addCase(deleteReview.fulfilled, (s, a) => {
                s.reviewLoading = false;
                if (a.payload && a.payload._id) {
                    s.reviews = s.reviews.filter(x => String(x._id) !== String(a.payload._id));
                    if (s.review && String(s.review._id) === String(a.payload._id)) s.review = null;
                }
            })
            .addCase(deleteReview.rejected, (s, a) => { s.reviewLoading = false; s.reviewError = a.payload || a.error.message; });
    }
});

export const { clearReview, clearReviewError } = reviewsSlice.actions;
export const selectReviews = state => state.reviews;
export default reviewsSlice.reducer;
