import {createSlice} from "@reduxjs/toolkit";
import {orders} from "./orders";

const ordersSlice = createSlice({
    name: 'orders',
    reducers: {},
    initialState: {
        orders: [...orders],
        orderLoading: false,
        orderError: null,
        order: {}
    },
    extraReducers: builder => {}
});

const {reducer} = ordersSlice;
export const selectOrder = state => state.orders;

export default reducer;