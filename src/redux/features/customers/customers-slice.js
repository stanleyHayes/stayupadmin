import {createSlice} from "@reduxjs/toolkit";
import {customers} from "./customers";

const customersSlice = createSlice({
    name: 'customers',
    reducers: {},
    initialState: {
        customers: [...customers],
        customerLoading: false,
        customerError: null,
        customer: {}
    },
    extraReducers: builder => {}
});

const {reducer} = customersSlice;
export const selectCustomer = state => state.customers;

export default reducer;