import {createTheme} from "@mui/material";

const lightTheme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                }
            }
        }
    },
    typography: {
        fontFamily: "EuclidCircularA, EuclidCircularB, Outfit, Eudoxus Sans, GoogleSans, Urbanist, Gilroy, Manrope"
    },
    palette: {
        primary: {
            main: "#FFFFFF"
        },
        secondary: {
            main: "#28a745"
        },
        background: {
            alternative: '#f5f6fb',
            default: "#F8F8F8",
            paper: "#ffffff",
            transparent: "rgba(255, 255, 255, 0.03)",
            overlay: 'rgba(0, 0, 0, 0.65)',
        },
        text: {
            heading: '#000000',
            muted: '#BDBDBD',
            primary: "#212121",
            secondary: "#616161",
            success: "#3fcd69",
            error: "#e08f8b",
            completed: '#28a745',
            green: '#28a745',
            active: '#28a745',
            processing: '#007bff',
            blue: '#007bff',
            hold: '#fd7e14',
            orange: '#fd7e14',
            pending_payment: '#ffc107',
            yellow: '#ffc107',
            failed: '#dc3545',
            suspended: '#dc3545',
            red: '#dc3545',
            cancelled: '#6c757d',
            pending: '#6c757d',
            grey: '#6c757d',
            refunded: '#17a2b8'
        },
        light: {
            secondary: "#EDF4FF",
            white: "rgba(255,255,255,0.3)",
            accent: "rgba(251,160,36,0.3)",
            orange: "rgba(254,141,116,0.1)",
            success: "#e0ffeb",
            error: "#faeded",
            completed: 'rgba(40,167,69,0.1)',
            green: 'rgba(40,167,69,0.1)',
            active: 'rgba(40,167,69,0.1)',
            processing: 'rgba(0,123,255,0.1)',
            blue: 'rgba(0,123,255,0.1)',
            hold: 'rgba(253,126,20,0.1)',
            pending_payment: 'rgba(255,193,7,0.1)',
            yellow: 'rgba(255,193,7,0.1)',
            failed: '#feefee',
            red: '#feefee',
            cancelled: 'rgba(108,117,125,0.1)',
            pending: 'rgba(108,117,125,0.1)',
            grey: 'rgba(108,117,125,0.1)',
            refunded: 'rgba(23,162,184,0.1)',
        },
        colors: {
            purple: "#a98df1",
            orange: "#fe8d74",
            blue: "#3176fe",
            yellow: "#fea706",
            red: '#ff3f5e',
            green: "#3fcd69",
            active: "#3fcd69",
            error: "#e08f8b",
            completed: '#28a745',
            processing: '#007bff',
            hold: '#fd7e14',
            pending_payment: '#ffc107',
            failed: '#dc3545',
            cancelled: '#6c757d',
            pending: '#6c757d',
            grey: '#6c757d',
            refunded: '#17a2b8'
        },
        icon: {
            default: "#aaaaaa",
            accent: "#c89743",
            yellow: "#c89743",
            secondary: "#247FFB",
            accentBackground: "rgba(200,151,67,0.05)",
            secondaryBackground: "rgba(49,118,254,0.3)",
            blue: "rgba(49,118,254,0.3)",
            orange: "rgba(254,141,116,0.5)",
            red: '#f17d73',
            green: "rgba(63,205,105,0.5)",
            active: "rgba(63,205,105,0.05)",
            error: "rgba(224,143,139,0.05)",
            completed: 'rgba(40,167,69,0.05)',
            processing: 'rgba(0,123,255,0.05)',
            hold: 'rgba(253,126,20,0.05)',
            pending_payment: 'rgba(255,193,7,0.05)',
            failed: '#f17d73',
            cancelled: 'rgba(108,117,125,0.05)',
            pending: 'rgba(108,117,125,0.05)',
            grey: 'rgba(108,117,125,0.5)',
            refunded: 'rgba(23,162,184,0.05)'
        },
        border: {
            white: "rgba(255,255,255,0.1)",
            default: "rgba(204,204,204,0.3)",
            secondary: "rgba(49,118,254,0.1)",
            orange: "rgba(254,141,116,0.1)",
            red: 'rgba(255,63,94,0.1)',
            green: "rgba(63,205,105,0.1)",
            active: "rgba(63,205,105,0.5)",
            error: "rgba(224,143,139,0.3)",
            completed: 'rgba(40,167,69,0.5)',
            processing: 'rgba(0,123,255,0.5)',
            blue: 'rgba(0,123,255,0.1)',
            hold: 'rgba(253,126,20,0.5)',
            pending_payment: 'rgba(255,193,7,0.5)',
            yellow: 'rgba(255,193,7,0.1)',
            failed: 'rgba(220,53,69,0.5)',
            cancelled: 'rgba(108,117,125,0.5)',
            pending: 'rgba(108,117,125,0.5)',
            grey: 'rgba(108,117,125,0.1)',
            refunded: 'rgba(23,162,184,0.5)'
        },
        mode: "light",
    },
    shape: {
        borderRadius: 32
    }
});

const darkTheme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                }
            }
        }
    },
    typography: {
        fontFamily: "EuclidCircularA, EuclidCircularB, Outfit, Eudoxus Sans, GoogleSans, Urbanist, Gilroy, Manrope"
    },
    palette: {
        primary: {
            main: "#1e2223"
        },
        secondary: {
            main: "#28a745"
        },
        background: {
            alternative: '#262626',
            default: "#121212",
            paper: "#2A2A2A",
            transparent: "rgba(0, 0, 0, 0.03)",
            overlay: 'rgba(0, 0, 0, 0.65)',
        },
        text: {
            muted: '#666666',
            heading: '#FFFFFF',
            primary: "#E0E0E0",
            secondary: "#B0B0B0",
            success: "#3fcd69",
            error: "#e08f8b",
            completed: '#28a745',
            active: '#28a745',
            green: '#28a745',
            processing: '#007bff',
            blue: '#007bff',
            hold: '#fd7e14',
            orange: '#fd7e14',
            pending_payment: '#ffc107',
            yellow: '#ffc107',
            failed: '#dc3545',
            red: '#dc3545',
            cancelled: '#6c757d',
            pending: '#6c757d',
            grey: '#6c757d',
            refunded: '#17a2b8'
        },
        light: {
            white: "rgba(255,255,255,0.3)",
            secondary: "rgba(40,167,69,0.08)",
            accent: "rgba(251,160,36,0.3)",
            orange: "rgba(254,141,116,0.1)",
            success: "#e0ffeb",
            error: "#faeded",
            completed: 'rgba(40,167,69,0.1)',
            green: 'rgba(40,167,69,0.1)',
            active: 'rgba(40,167,69,0.1)',
            processing: 'rgba(0,123,255,0.1)',
            blue: 'rgba(0,123,255,0.1)',
            hold: 'rgba(253,126,20,0.1)',
            pending_payment: 'rgba(255,193,7,0.1)',
            yellow: 'rgba(255,193,7,0.1)',
            failed: 'rgba(220,53,69,0.1)',
            red: 'rgba(254,239,238,0.1)',
            cancelled: 'rgba(108,117,125,0.1)',
            pending: 'rgba(108,117,125,0.1)',
            grey: 'rgba(108,117,125,0.1)',
            refunded: 'rgba(23,162,184,0.1)'
        },
        colors: {
            purple: "#a98df1",
            blue: "#3176fe",
            yellow: "#fea706",
            red: '#ff3f5e',
            green: "#3fcd69",
            active: "#3fcd69",
            error: "#e08f8b",
            completed: '#28a745',
            processing: '#007bff',
            hold: '#fd7e14',
            orange: '#fd7e14',
            pending_payment: '#ffc107',
            failed: '#dc3545',
            cancelled: '#6c757d',
            pending: '#6c757d',
            grey: '#6c757d',
            refunded: '#17a2b8'
        },
        icon: {
            default: "#aaaaaa",
            accent: "#c89743",
            secondary: "#28a745",
            accentBackground: "rgba(200,151,67,0.05)",
            secondaryBackground: "rgba(49,118,254,0.05)",
            orange: "rgba(254,141,116,0.5)",
            red: '#dc3545',
            green: "rgba(63,205,105,0.5)",
            active: "rgba(63,205,105,0.5)",
            error: "rgba(224,143,139,0.05)",
            completed: 'rgba(40,167,69,0.05)',
            processing: 'rgba(0,123,255,0.05)',
            blue: 'rgba(0,123,255,0.5)',
            hold: 'rgba(253,126,20,0.05)',
            pending_payment: 'rgba(255,193,7,0.05)',
            yellow: 'rgba(255,193,7,0.5)',
            failed: '#dc3545',
            cancelled: 'rgba(108,117,125,0.05)',
            pending: 'rgba(108,117,125,0.05)',
            grey: 'rgba(108,117,125,0.5)',
            refunded: 'rgba(23,162,184,0.05)'
        },
        border: {
            default: "rgba(204,204,204,0.09)",
            secondary: "rgba(40,167,69,0.09)",
            orange: "rgba(254,141,116,0.1)",
            red: 'rgba(255,63,94,0.1)',
            green: "rgba(63,205,105,0.1)",
            white: "rgba(255,255,255,0.1)",
            active: "rgba(63,205,105,0.1)",
            error: "rgba(224,143,139,0.3)",
            completed: 'rgba(40,167,69,0.1)',
            processing: 'rgba(0,123,255,0.5)',
            blue: 'rgba(0,123,255,0.1)',
            hold: 'rgba(253,126,20,0.5)',
            pending_payment: 'rgba(255,193,7,0.5)',
            yellow: 'rgba(255,193,7,0.1)',
            failed: 'rgba(220,53,69,0.5)',
            cancelled: 'rgba(108,117,125,0.5)',
            pending: 'rgba(108,117,125,0.5)',
            grey: 'rgba(108,117,125,0.1)',
            refunded: 'rgba(23,162,184,0.5)'
        },
        mode: "dark",
    },
    shape: {
        borderRadius: 32
    }
});

export const THEMES = {darkTheme, lightTheme};
