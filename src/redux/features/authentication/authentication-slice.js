import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { STAY_UP_ADMIN_CONSTANTS } from "../../../utils/constants.js";

const token = localStorage.getItem("token");

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/auth/login`, credentials);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Login failed");
    }
});

export const getProfile = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/auth/profile`);
        return data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || err.message || "Failed to fetch profile");
    }
});

const authenticationSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: token || null,
        isAuthenticated: !!token,
        authLoading: false,
        authError: null,
    },
    reducers: {
        updateUser(state, action) {
            state.user = { ...state.user, ...action.payload };
        },
        login(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.data;
            if (action.payload.token) {
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            }
            state.authError = null;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            state.authError = null;
        },
        clearAuthError(state) {
            state.authError = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, s => { s.authLoading = true; s.authError = null; })
            .addCase(loginUser.fulfilled, (s, a) => {
                s.authLoading = false;
                s.isAuthenticated = true;
                // Backend returns { message, token, data: adminObject }
                s.user = a.payload.data;
                if (a.payload.token) {
                    s.token = a.payload.token;
                    localStorage.setItem("token", a.payload.token);
                }
            })
            .addCase(loginUser.rejected, (s, a) => {
                s.authLoading = false;
                s.authError = a.payload || a.error.message;
            })

            .addCase(getProfile.pending, s => { s.authLoading = true; })
            .addCase(getProfile.fulfilled, (s, a) => {
                s.authLoading = false;
                // Backend returns { data: adminObject } or the admin directly
                s.user = a.payload.data;
            })
            .addCase(getProfile.rejected, (s, a) => {
                s.authLoading = false;
                if (a.payload === "Unauthorized" || a.meta?.rejectedWithValue) {
                    s.isAuthenticated = false;
                    s.user = null;
                    s.token = null;
                    localStorage.removeItem("token");
                }
            });
    }
});

export const { updateUser, login, logout, clearAuthError } = authenticationSlice.actions;
const { reducer } = authenticationSlice;
export const selectAuth = state => state.auth;
export default reducer;
