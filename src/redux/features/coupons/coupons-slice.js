// redux/features/attributes/attributes-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {STAY_UP_ADMIN_CONSTANTS} from "./../../../utils/constants.js";
import {coupons} from "./coupons.js";
/**
 * Update this to the base URL of your API, or import from your central config.
 * Example: import { STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE } from '../../config'
 */


/**
 * Thunks
 * - fetchCoupons: get all (optionally accepts query/filter params)
 * - fetchCoupon: get one by id
 * - createCoupon: create new coupon
 * - updateCoupon: update coupon by id
 * - deleteCoupon: delete (soft/hard depending on API) by id
 *
 * Each thunk returns payload data or uses rejectWithValue for errors.
 */

export const fetchCoupons = createAsyncThunk(
    "attributes/fetchCoupons",
    async (params = {}, { rejectWithValue }) => {
        try {
            // params can be used for paging/filters: { page, limit, q, status, startDate, endDate }
            const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons`, { params });
            // expect response: { data: [ ...attributes ] } or directly an array
            return data;
        } catch (err) {
            // normalize axios error
            const msg = err?.response?.data?.message || err.message || "Failed to fetch attributes";
            return rejectWithValue(msg);
        }
    }
);

export const fetchCoupon = createAsyncThunk(
    "attributes/fetchCoupon",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons/${id}`);
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to fetch coupon";
            return rejectWithValue(msg);
        }
    }
);

export const createCoupon = createAsyncThunk(
    "attributes/createCoupon",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons`, payload);
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to create coupon";
            return rejectWithValue(msg);
        }
    }
);

export const updateCoupon = createAsyncThunk(
    "attributes/updateCoupon",
    async ({ id, data: payload }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons/${id}`, payload);
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to update coupon";
            return rejectWithValue(msg);
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    "attributes/deleteCoupon",
    async (id, { rejectWithValue }) => {
        try {
            // change to DELETE or POST depending on your API implementation for soft-delete
            const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/coupons/${id}`);
            return { id, data };
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to delete coupon";
            return rejectWithValue(msg);
        }
    }
);

/**
 * Initial state matches the shape you provided in the UI:
 * { attributes: [], coupon: null, couponLoading: false, couponError: null }
 */
const couponsSlice = createSlice({
    name: "coupons",
    initialState: {
        coupons: [...coupons],
        coupon: null,
        couponLoading: false,
        couponError: null,
        // helpful metadata for paging and last action statuses
        total: 0,
        lastAction: null
    },
    reducers: {
        // optional synchronous reducers you might want later
        clearCouponError(state) {
            state.couponError = null;
        },
        clearCoupon(state) {
            state.coupon = null;
        }
    },
    extraReducers: (builder) => {
        // fetchCoupons
        builder.addCase(fetchCoupons.pending, (state) => {
            state.couponLoading = true;
            state.couponError = null;
            state.lastAction = "fetchCoupons.pending";
        });
        builder.addCase(fetchCoupons.fulfilled, (state, action) => {
            state.couponLoading = false;
            // allow backend to return either array or { data: [], total } shapes
            if (Array.isArray(action.payload)) {
                state.coupons = action.payload;
                state.total = action.payload.length;
            } else if (action.payload && Array.isArray(action.payload.data)) {
                state.coupons = action.payload.data;
                state.total = action.payload.total ?? action.payload.data.length;
            } else {
                // fallback if server returns single object
                state.coupons = action.payload ? [action.payload] : [];
                state.total = state.coupons.length;
            }
            state.lastAction = "fetchCoupons.fulfilled";
        });
        builder.addCase(fetchCoupons.rejected, (state, action) => {
            state.couponLoading = false;
            state.couponError = action.payload || action.error?.message || "Failed to load attributes";
            state.lastAction = "fetchCoupons.rejected";
        });

        // fetchCoupon (single)
        builder.addCase(fetchCoupon.pending, (state) => {
            state.couponLoading = true;
            state.couponError = null;
            state.lastAction = "fetchCoupon.pending";
        });
        builder.addCase(fetchCoupon.fulfilled, (state, action) => {
            state.couponLoading = false;
            state.coupon = action.payload;
            state.lastAction = "fetchCoupon.fulfilled";
        });
        builder.addCase(fetchCoupon.rejected, (state, action) => {
            state.couponLoading = false;
            state.couponError = action.payload || action.error?.message || "Failed to load coupon";
            state.lastAction = "fetchCoupon.rejected";
        });

        // createCoupon
        builder.addCase(createCoupon.pending, (state) => {
            state.couponLoading = true;
            state.couponError = null;
            state.lastAction = "createCoupon.pending";
        });
        builder.addCase(createCoupon.fulfilled, (state, action) => {
            state.couponLoading = false;
            // append to list (server should return created object)
            if (action.payload) {
                // if payload is wrapped, try to extract .data
                const created = action.payload.data ?? action.payload;
                if (created) state.coupons.unshift(created);
            }
            state.lastAction = "createCoupon.fulfilled";
        });
        builder.addCase(createCoupon.rejected, (state, action) => {
            state.couponLoading = false;
            state.couponError = action.payload || action.error?.message || "Failed to create coupon";
            state.lastAction = "createCoupon.rejected";
        });

        // updateCoupon
        builder.addCase(updateCoupon.pending, (state) => {
            state.couponLoading = true;
            state.couponError = null;
            state.lastAction = "updateCoupon.pending";
        });
        builder.addCase(updateCoupon.fulfilled, (state, action) => {
            state.couponLoading = false;
            const updated = action.payload?.data ?? action.payload;
            if (updated && (updated._id || updated.id)) {
                const id = updated._id ?? updated.id;
                const idx = state.coupons.findIndex(c => (c._id ?? c.id) === id);
                if (idx !== -1) state.coupons[idx] = { ...state.coupons[idx], ...updated };
                // if the currently selected coupon is the same, update it too
                if (state.coupon && (state.coupon._id ?? state.coupon.id) === id) {
                    state.coupon = { ...state.coupon, ...updated };
                }
            }
            state.lastAction = "updateCoupon.fulfilled";
        });
        builder.addCase(updateCoupon.rejected, (state, action) => {
            state.couponLoading = false;
            state.couponError = action.payload || action.error?.message || "Failed to update coupon";
            state.lastAction = "updateCoupon.rejected";
        });

        // deleteCoupon
        builder.addCase(deleteCoupon.pending, (state) => {
            state.couponLoading = true;
            state.couponError = null;
            state.lastAction = "deleteCoupon.pending";
        });
        builder.addCase(deleteCoupon.fulfilled, (state, action) => {
            state.couponLoading = false;
            const id = action.payload?.id;
            if (id) {
                // remove from list
                state.coupons = state.coupons.filter(c => (c._id ?? c.id) !== id);
                // if selected coupon was deleted, clear it
                if (state.coupon && (state.coupon._id ?? state.coupon.id) === id) state.coupon = null;
            }
            state.lastAction = "deleteCoupon.fulfilled";
        });
        builder.addCase(deleteCoupon.rejected, (state, action) => {
            state.couponLoading = false;
            state.couponError = action.payload || action.error?.message || "Failed to delete coupon";
            state.lastAction = "deleteCoupon.rejected";
        });
    }
});

export const { clearCouponError, clearCoupon } = couponsSlice.actions;
const { reducer } = couponsSlice;

// selector the UI expects
export const selectCoupons = (state) => state.coupons;

// default export reducer
export default reducer;
