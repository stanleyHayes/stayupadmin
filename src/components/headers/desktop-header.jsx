import {Box, Divider, Stack, Toolbar, Typography} from "@mui/material";
import {
    Close, DarkModeOutlined, GridOn, LightModeOutlined,
    ListAlt, Menu
} from "@mui/icons-material";
import {selectUI, UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import {useDispatch, useSelector} from "react-redux";
import ProfileDropdown from "../shared/profile-dropdown.jsx";
import NotificationDropdown from "../shared/notification-dropdown.jsx";
import {AnimatePresence, motion} from "framer-motion";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import {useLocation} from "react-router-dom";

const iconBtn = (active = false) => ({
    padding: 0.75,
    fontSize: 32,
    borderRadius: 1,
    color: active ? "secondary.main" : "text.secondary",
    backgroundColor: active ? "light.secondary" : "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
        backgroundColor: "light.secondary",
        color: "secondary.main",
    },
});

const pageTitles = {
    "/": "Dashboard", "/analytics": "Analytics", "/revenue": "Revenue",
    "/orders": "Orders", "/products": "Products", "/customers": "Customers",
    "/categories": "Categories", "/coupons": "Coupons", "/settings": "Settings",
};

const DesktopHeader = () => {
    const dispatch = useDispatch();
    const {sidebarExpanded, theme, view} = useSelector(selectUI);
    const {user} = useSelector(selectAuth);
    const {pathname} = useLocation();

    const pageTitle = pageTitles[pathname] || pathname.split("/").filter(Boolean)[0]?.replace(/-/g, " ") || "Dashboard";

    return (
        <Toolbar
            sx={{
                backgroundColor: theme === "dark" ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "divider",
                width: "100%",
                py: 0.5,
                minHeight: "56px !important",
            }}
            variant="dense">
            <Stack sx={{width: "100%"}} direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                {/* Left */}
                <Stack spacing={1.5} direction="row" alignItems="center">
                    <AnimatePresence mode="wait">
                        {sidebarExpanded ? (
                            <Box key="close" component={motion.div} initial={{rotate: -90, opacity: 0}} animate={{rotate: 0, opacity: 1}} exit={{rotate: 90, opacity: 0}} transition={{duration: 0.15}}>
                                <Close onClick={() => dispatch(UI_ACTION_CREATORS.toggleSidebar())} sx={iconBtn(true)}/>
                            </Box>
                        ) : (
                            <Box key="menu" component={motion.div} initial={{rotate: 90, opacity: 0}} animate={{rotate: 0, opacity: 1}} exit={{rotate: -90, opacity: 0}} transition={{duration: 0.15}}>
                                <Menu onClick={() => dispatch(UI_ACTION_CREATORS.toggleSidebar())} sx={iconBtn()}/>
                            </Box>
                        )}
                    </AnimatePresence>
                    <Divider flexItem variant="middle" orientation="vertical"/>
                    <Stack spacing={0.25}>
                        <Typography variant="body2" sx={{color: "text.primary", fontWeight: 600, fontSize: 14, textTransform: "capitalize", lineHeight: 1.2}}>
                            {pageTitle}
                        </Typography>
                        <Typography variant="caption" sx={{color: "text.secondary", fontSize: 11}}>
                            Welcome back, {user?.first_name || user?.display_name || "Admin"}
                        </Typography>
                    </Stack>
                </Stack>

                {/* Right */}
                <Stack spacing={1} direction="row" alignItems="center">
                    <ProfileDropdown/>

                    <Divider flexItem variant="middle" orientation="vertical" sx={{mx: 0.5}}/>

                    <NotificationDropdown iconSx={iconBtn()}/>

                    <AnimatePresence mode="wait">
                        {theme === "dark" ? (
                            <Box key="light" component={motion.div} initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.5, opacity: 0}} transition={{duration: 0.15}}>
                                <LightModeOutlined onClick={() => dispatch(UI_ACTION_CREATORS.toggleTheme())} sx={iconBtn()}/>
                            </Box>
                        ) : (
                            <Box key="dark" component={motion.div} initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.5, opacity: 0}} transition={{duration: 0.15}}>
                                <DarkModeOutlined onClick={() => dispatch(UI_ACTION_CREATORS.toggleTheme())} sx={iconBtn()}/>
                            </Box>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {view === "grid" ? (
                            <Box key="list" component={motion.div} initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.5, opacity: 0}} transition={{duration: 0.15}}>
                                <ListAlt onClick={() => dispatch(UI_ACTION_CREATORS.toggleView())} sx={iconBtn()}/>
                            </Box>
                        ) : (
                            <Box key="grid" component={motion.div} initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.5, opacity: 0}} transition={{duration: 0.15}}>
                                <GridOn onClick={() => dispatch(UI_ACTION_CREATORS.toggleView())} sx={iconBtn()}/>
                            </Box>
                        )}
                    </AnimatePresence>
                </Stack>
            </Stack>
        </Toolbar>
    );
};

export default DesktopHeader;
