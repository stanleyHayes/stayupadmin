import {createSlice} from "@reduxjs/toolkit";

const couponsSlice = createSlice({
    name:'coupons',
    initialState:{
        coupons: [],
        coupon: null,
        couponLoading: false,
        couponError: null
    },
    reducers: {},
    extraReducers: builder => {}
});


const {reducer} = couponsSlice;
export const selectCoupons = state => state.coupons;
export default reducer;

