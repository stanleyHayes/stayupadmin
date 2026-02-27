import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {STAY_UP_ADMIN_CONSTANTS} from "../../../utils/constants.js";
import {categories} from "./categories.js";
/**
 * Update STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE to your backend endpoint or import a config.
 */

/**
 * Thunks:
 * - fetchCategories(params)
 * - fetchCategory(id)
 * - createCategory(payload)
 * - updateCategory({id, data})
 * - deleteCategory(id)
 */
export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/categories`, { params });
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to fetch categories";
            return rejectWithValue(msg);
        }
    }
);

export const fetchCategory = createAsyncThunk(
    "categories/fetchCategory",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/categories/${id}`);
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to fetch category";
            return rejectWithValue(msg);
        }
    }
);

export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/categories`, payload);
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to create category";
            return rejectWithValue(msg);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, data: payload }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/categories/${id}`, payload);
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to update category";
            return rejectWithValue(msg);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/categories/${id}`);
            return { id, data };
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Failed to delete category";
            return rejectWithValue(msg);
        }
    }
);

const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        categories: [...categories],
        category: null,
        categoryLoading: false,
        categoryError: null,
        total: 0
    },
    reducers: {
        clearCategoryError(state) {
            state.categoryError = null;
        },
        clearCategory(state) {
            state.category = null;
        }
    },
    extraReducers: (builder) => {
        // fetchCategories
        builder.addCase(fetchCategories.pending, (state) => {
            state.categoryLoading = true;
            state.categoryError = null;
        });
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.categoryLoading = false;
            if (Array.isArray(action.payload)) {
                state.categories = action.payload;
                state.total = action.payload.length;
            } else if (action.payload && Array.isArray(action.payload.data)) {
                state.categories = action.payload.data;
                state.total = action.payload.total ?? action.payload.data.length;
            } else {
                state.categories = action.payload ? [action.payload] : [];
                state.total = state.categories.length;
            }
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.categoryLoading = false;
            state.categoryError = action.payload || action.error?.message || "Failed to load categories";
        });

        // fetchCategory
        builder.addCase(fetchCategory.pending, (state) => {
            state.categoryLoading = true;
            state.categoryError = null;
        });
        builder.addCase(fetchCategory.fulfilled, (state, action) => {
            state.categoryLoading = false;
            state.category = action.payload;
        });
        builder.addCase(fetchCategory.rejected, (state, action) => {
            state.categoryLoading = false;
            state.categoryError = action.payload || action.error?.message || "Failed to load category";
        });

        // createCategory
        builder.addCase(createCategory.pending, (state) => {
            state.categoryLoading = true;
            state.categoryError = null;
        });
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.categoryLoading = false;
            const created = action.payload?.data ?? action.payload;
            if (created) state.categories.unshift(created);
        });
        builder.addCase(createCategory.rejected, (state, action) => {
            state.categoryLoading = false;
            state.categoryError = action.payload || action.error?.message || "Failed to create category";
        });

        // updateCategory
        builder.addCase(updateCategory.pending, (state) => {
            state.categoryLoading = true;
            state.categoryError = null;
        });
        builder.addCase(updateCategory.fulfilled, (state, action) => {
            state.categoryLoading = false;
            const updated = action.payload?.data ?? action.payload;
            if (updated && (updated._id || updated.id)) {
                const id = updated._id ?? updated.id;
                const idx = state.categories.findIndex(c => (c._id ?? c.id) === id);
                if (idx !== -1) state.categories[idx] = { ...state.categories[idx], ...updated };
                if (state.category && (state.category._id ?? state.category.id) === id) {
                    state.category = { ...state.category, ...updated };
                }
            }
        });
        builder.addCase(updateCategory.rejected, (state, action) => {
            state.categoryLoading = false;
            state.categoryError = action.payload || action.error?.message || "Failed to update category";
        });

        // deleteCategory
        builder.addCase(deleteCategory.pending, (state) => {
            state.categoryLoading = true;
            state.categoryError = null;
        });
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            state.categoryLoading = false;
            const id = action.payload?.id;
            if (id) {
                state.categories = state.categories.filter(c => (c._id ?? c.id) !== id);
                if (state.category && (state.category._id ?? state.category.id) === id) state.category = null;
            }
        });
        builder.addCase(deleteCategory.rejected, (state, action) => {
            state.categoryLoading = false;
            state.categoryError = action.payload || action.error?.message || "Failed to delete category";
        });
    }
});

export const { clearCategoryError, clearCategory } = categoriesSlice.actions;
export const selectCategories = (state) => state.categories;
export default categoriesSlice.reducer;
