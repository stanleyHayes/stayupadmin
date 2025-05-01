import {createSlice} from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
    name:'categories',
    initialState:{
        categories: [],
        category: null,
        categoryLoading: false,
        categoryError: null
    },
    reducers: {},
    extraReducers: builder => {}
});


const {reducer} = categoriesSlice;
export const selectCategories = state => state.categories;
export default reducer;

