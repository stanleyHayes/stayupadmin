import {createSlice} from "@reduxjs/toolkit";
import {STAY_UP_ADMIN_CONSTANTS} from "../../../utils/constants";

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        theme: localStorage.getItem(STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_THEME) ?
            JSON.parse(localStorage.getItem(STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_THEME)):
            'dark',
        view: localStorage.getItem(STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_VIEW) ?
            JSON.parse(localStorage.getItem(STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_VIEW)):
            'grid',
        sidebarExpanded: localStorage.getItem(STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_SIDEBAR_EXPANDED) ?
            JSON.parse(localStorage.getItem(STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_SIDEBAR_EXPANDED)):
            true,
        drawerOpen: false,
        language: {device: 'en', preferred: ''}
    },
    reducers: {
        toggleDrawer: (state, action) => {
            state.drawerOpen = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarExpanded = !state.sidebarExpanded;
            localStorage.setItem(
                STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_SIDEBAR_EXPANDED,
                JSON.stringify(state.sidebarExpanded)
            )
        },
        toggleView: (state) => {
            state.view = state.view === 'grid' ? 'list': 'grid';
            localStorage.setItem(
                STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_VIEW,
                JSON.stringify(state.view)
            )
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light': 'dark';
            localStorage.setItem(
                STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_THEME,
                JSON.stringify(state.theme)
            )
        }
    }
});


const {reducer, actions} = uiSlice;

const {toggleTheme, toggleDrawer, toggleSidebar, toggleView} = actions;
export const UI_ACTION_CREATORS = {toggleTheme, toggleDrawer, toggleSidebar, toggleView};
export const selectUI = state => state.ui;
export default reducer;
