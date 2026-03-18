import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchCoupons = createAsyncThunk("coupons/fetchCoupons", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch coupons");
    }
});

export const fetchCoupon = createAsyncThunk("coupons/fetchCoupon", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch coupon");
    }
});

export const createCoupon = createAsyncThunk("coupons/createCoupon", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create coupon");
    }
});

export const updateCoupon = createAsyncThunk("coupons/updateCoupon", async ({ id, data: payload }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons/${id}`, payload);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update coupon");
    }
});

export const deleteCoupon = createAsyncThunk("coupons/deleteCoupon", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons/${id}`);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete coupon");
    }
});

const couponsSlice = createSlice({
    name: "coupons",
    initialState: {
        coupons: [],
        coupon: null,
        couponLoading: false,
        couponError: null,
        total: 0
    },
    reducers: {
        clearCouponError(state) { state.couponError = null; },
        clearCoupon(state) { state.coupon = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => {
                state.couponLoading = true;
                state.couponError = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.couponLoading = false;
                if (Array.isArray(action.payload)) {
                    state.coupons = action.payload;
                    state.total = action.payload.length;
                } else if (action.payload && Array.isArray(action.payload.data)) {
                    state.coupons = action.payload.data;
                    state.total = action.payload.total ?? action.payload.data.length;
                } else {
                    state.coupons = action.payload ? [action.payload] : [];
                    state.total = state.coupons.length;
                }
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.couponLoading = false;
                state.couponError = action.payload || action.error?.message || "Failed to load coupons";
            })

            .addCase(fetchCoupon.pending, (state) => {
                state.couponLoading = true;
                state.couponError = null;
            })
            .addCase(fetchCoupon.fulfilled, (state, action) => {
                state.couponLoading = false;
                state.coupon = action.payload;
            })
            .addCase(fetchCoupon.rejected, (state, action) => {
                state.couponLoading = false;
                state.couponError = action.payload || action.error?.message || "Failed to load coupon";
            })

            .addCase(createCoupon.pending, (state) => {
                state.couponLoading = true;
                state.couponError = null;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.couponLoading = false;
                const created = action.payload?.data ?? action.payload;
                if (created) state.coupons.unshift(created);
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.couponLoading = false;
                state.couponError = action.payload || action.error?.message || "Failed to create coupon";
            })

            .addCase(updateCoupon.pending, (state) => {
                state.couponLoading = true;
                state.couponError = null;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.couponLoading = false;
                const updated = action.payload?.data ?? action.payload;
                if (updated && (updated._id || updated.id)) {
                    const id = updated._id ?? updated.id;
                    const idx = state.coupons.findIndex(c => (c._id ?? c.id) === id);
                    if (idx !== -1) state.coupons[idx] = { ...state.coupons[idx], ...updated };
                    if (state.coupon && (state.coupon._id ?? state.coupon.id) === id) {
                        state.coupon = { ...state.coupon, ...updated };
                    }
                }
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.couponLoading = false;
                state.couponError = action.payload || action.error?.message || "Failed to update coupon";
            })

            .addCase(deleteCoupon.pending, (state) => {
                state.couponLoading = true;
                state.couponError = null;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.couponLoading = false;
                const id = action.payload?.id;
                if (id) {
                    state.coupons = state.coupons.filter(c => (c._id ?? c.id) !== id);
                    if (state.coupon && (state.coupon._id ?? state.coupon.id) === id) state.coupon = null;
                }
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.couponLoading = false;
                state.couponError = action.payload || action.error?.message || "Failed to delete coupon";
            });
    }
});

export const { clearCouponError, clearCoupon } = couponsSlice.actions;
export const selectCoupons = (state) => state.coupons;
export default couponsSlice.reducer;
