import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

export const fetchCouriers = createAsyncThunk("couriers/fetchCouriers", async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/couriers`, { params });
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch couriers");
    }
});

const couriersSlice = createSlice({
    name: "couriers",
    initialState: {
        couriers: [],
        courierLoading: false,
        courierError: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCouriers.pending, s => { s.courierLoading = true; s.courierError = null; })
            .addCase(fetchCouriers.fulfilled, (s, a) => {
                s.courierLoading = false;
                if (Array.isArray(a.payload)) s.couriers = a.payload;
                else if (a.payload && Array.isArray(a.payload.data)) s.couriers = a.payload.data;
                else s.couriers = [];
            })
            .addCase(fetchCouriers.rejected, (s, a) => { s.courierLoading = false; s.courierError = a.payload || a.error.message; });
    }
});

export const selectCouriers = state => state.couriers;
export default couriersSlice.reducer;
