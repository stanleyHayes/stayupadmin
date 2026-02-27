// src/redux/features/products/products-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { products as seedProducts } from "./products.js"; // adjust path to where you keep the seed file
import {STAY_UP_ADMIN_CONSTANTS} from "../../../utils/constants.js";

/**
 * Thunks:
 * - fetchProducts(params)
 * - fetchProduct(id)
 * - createProduct(payload)
 * - updateProduct({id, data})
 * - deleteProduct(id)
 *
 * If you don't have a backend yet, the UI will still render using the seed data
 * present in initialState.products. When you enable API, these thunks will call it.
 */

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/products`, { params });
            return data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch products");
        }
    }
);

export const fetchProduct = createAsyncThunk(
    "products/fetchProduct",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/products/${id}`);
            return data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch product");
        }
    }
);

export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/products`, payload);
            return data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || err.message || "Failed to create product");
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, data: payload }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/products/${id}`, payload);
            return data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || err.message || "Failed to update product");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/products/${id}`);
            return { id, data };
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || err.message || "Failed to delete product");
        }
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        // initialize from seed so UI renders even without an API
        products: Array.isArray(seedProducts) ? seedProducts : [],
        product: null,
        productLoading: false,
        productError: null,
        total: Array.isArray(seedProducts) ? seedProducts.length : 0
    },
    reducers: {
        clearProductError(state) {
            state.productError = null;
        },
        clearProduct(state) {
            state.product = null;
        },
        // local-only helpers (useful for dev without API)
        addLocalProduct(state, action) {
            state.products.unshift(action.payload);
            state.total = state.products.length;
        },
        updateLocalProduct(state, action) {
            const updated = action.payload;
            const id = updated.sku ?? updated._id ?? updated.id;
            const idx = state.products.findIndex(p => (p.sku ?? p._id ?? p.id) === id);
            if (idx !== -1) state.products[idx] = { ...state.products[idx], ...updated };
        },
        removeLocalProduct(state, action) {
            const id = action.payload;
            state.products = state.products.filter(p => (p.sku ?? p._id ?? p.id) !== id);
            state.total = state.products.length;
        }
    },
    extraReducers: builder => {
        // fetchProducts
        builder.addCase(fetchProducts.pending, state => {
            state.productLoading = true;
            state.productError = null;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.productLoading = false;
            if (Array.isArray(action.payload)) {
                state.products = action.payload;
                state.total = action.payload.length;
            } else if (action.payload && Array.isArray(action.payload.data)) {
                state.products = action.payload.data;
                state.total = action.payload.total ?? action.payload.data.length;
            } else {
                // single object response fallback
                state.products = action.payload ? [action.payload] : state.products;
                state.total = state.products.length;
            }
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.productLoading = false;
            state.productError = action.payload || action.error?.message || "Failed to fetch products";
        });

        // fetchProduct
        builder.addCase(fetchProduct.pending, state => {
            state.productLoading = true;
            state.productError = null;
        });
        builder.addCase(fetchProduct.fulfilled, (state, action) => {
            state.productLoading = false;
            state.product = action.payload;
        });
        builder.addCase(fetchProduct.rejected, (state, action) => {
            state.productLoading = false;
            state.productError = action.payload || action.error?.message || "Failed to fetch product";
        });

        // createProduct
        builder.addCase(createProduct.pending, state => {
            state.productLoading = true;
            state.productError = null;
        });
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.productLoading = false;
            const created = action.payload?.data ?? action.payload;
            if (created) state.products.unshift(created);
            state.total = state.products.length;
        });
        builder.addCase(createProduct.rejected, (state, action) => {
            state.productLoading = false;
            state.productError = action.payload || action.error?.message || "Failed to create product";
        });

        // updateProduct
        builder.addCase(updateProduct.pending, state => {
            state.productLoading = true;
            state.productError = null;
        });
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.productLoading = false;
            const updated = action.payload?.data ?? action.payload;
            if (!updated) return;
            const id = updated.sku ?? updated._id ?? updated.id;
            const idx = state.products.findIndex(p => (p.sku ?? p._id ?? p.id) === id);
            if (idx !== -1) state.products[idx] = { ...state.products[idx], ...updated };
            if (state.product && ((state.product.sku ?? state.product._id ?? state.product.id) === id)) {
                state.product = { ...state.product, ...updated };
            }
        });
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.productLoading = false;
            state.productError = action.payload || action.error?.message || "Failed to update product";
        });

        // deleteProduct
        builder.addCase(deleteProduct.pending, state => {
            state.productLoading = true;
            state.productError = null;
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.productLoading = false;
            const id = action.payload?.id;
            if (id) {
                state.products = state.products.filter(p => (p.sku ?? p._id ?? p.id) !== id);
                state.total = state.products.length;
                if (state.product && (state.product.sku ?? state.product._id ?? state.product.id) === id) {
                    state.product = null;
                }
            }
        });
        builder.addCase(deleteProduct.rejected, (state, action) => {
            state.productLoading = false;
            state.productError = action.payload || action.error?.message || "Failed to delete product";
        });
    }
});

export const {
    clearProductError,
    clearProduct,
    addLocalProduct,
    updateLocalProduct,
    removeLocalProduct
} = productsSlice.actions;

export const selectProducts = state => state.products;
export default productsSlice.reducer;
