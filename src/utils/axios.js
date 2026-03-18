import axios from "axios";
import store from "../redux/app/store";
import { logout } from "../redux/features/authentication/authentication-slice";

// Attach token to every request
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401 response, clear token and redirect to login
// Skip redirect for auth endpoints (login, register, etc.) so errors display inline
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const url = error.config?.url || "";
            const isAuthEndpoint = url.includes("/auth/");
            if (!isAuthEndpoint) {
                localStorage.removeItem("token");
                store.dispatch(logout());
                window.location.href = "/auth/login";
            }
        }
        return Promise.reject(error);
    }
);
