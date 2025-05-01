import {createSlice} from "@reduxjs/toolkit";
import profile from "./../../../assets/images/profile.jpg";

const authenticationSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {
            title: 'Count',
            firstName: 'Vladislaus',
            lastName: 'Draguila',
            email: 'vladiuslaus.draguila@vampires.org',
            username: "vlad",
            image: profile
        }
    },
    reducers: {}
});

const {reducer} = authenticationSlice;
export const selectAuth = state => state.auth;
export default reducer;