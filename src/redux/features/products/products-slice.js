import {createSlice} from "@reduxjs/toolkit";
import {products} from "./products";

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [...products],
        product: {},
        productLoading: false,
        productError: null
    },
    reducers: {},
    extraReducers: builder => {}
});

const {reducer} = productsSlice;

export const selectProducts = state => state.products;

export default reducer;