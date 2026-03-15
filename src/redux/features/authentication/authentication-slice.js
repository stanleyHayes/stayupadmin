import {createSlice} from "@reduxjs/toolkit";
import profile from "./../../../assets/images/profile.jpg";

const defaultUser = {
    title: 'Count',
    firstName: 'Vladislaus',
    lastName: 'Draguila',
    email: 'vladiuslaus.draguila@vampires.org',
    username: "vlad",
    phone: "+44 7911 123456",
    image: profile,
    role: "super_admin",
    status: "ACTIVE",
    is_verified: true,
    created_at: "2024-01-15T10:00:00.000Z"
};

const authenticationSlice = createSlice({
    name: 'auth',
    initialState: {
        user: defaultUser,
        isAuthenticated: true,
        authLoading: false,
        authError: null,
    },
    reducers: {
        updateUser(state, action) {
            state.user = {...state.user, ...action.payload};
        },
        login(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload || defaultUser;
            state.authError = null;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.authError = null;
        },
        setAuthLoading(state, action) {
            state.authLoading = action.payload;
        },
        setAuthError(state, action) {
            state.authError = action.payload;
            state.authLoading = false;
        },
        clearAuthError(state) {
            state.authError = null;
        }
    }
});

export const {updateUser, login, logout, setAuthLoading, setAuthError, clearAuthError} = authenticationSlice.actions;
const {reducer} = authenticationSlice;
export const selectAuth = state => state.auth;
export default reducer;
