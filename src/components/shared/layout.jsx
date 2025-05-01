import {Box, SwipeableDrawer} from "@mui/material";
import Sidebar from "../sidebar/sidebar.jsx";
import Header from "../headers/header.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectUI, UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import React from "react";
import MobileDrawer from "../sidebar/mobile-drawer.jsx";
import MobileBottomNavigation from "./mobile-bottom-navigation.jsx";

const Layout = ({children}) => {

    const {sidebarExpanded, drawerOpen} = useSelector(selectUI);
    const dispatch = useDispatch();
    return (
        <Box sx={{display: "flex", maxWidth: "100vw", minHeight: "100vh"}}>
            <Box
                sx={{
                    flexBasis: {
                        xs: "0%",
                        md: sidebarExpanded ? '30%' : '10%',
                        lg: sidebarExpanded ? '25%' : '5%'
                    },
                    display: {xs: "none", "md": "block"},
                    maxHeight: "100vh",
                    backgroundColor: "background.default",
                    borderRightWidth: 1,
                    borderRightStyle: "solid",
                    borderRightColor: "divider",
                    overflowY: "scroll",
                    overflowX: "hidden"
                }}>
                <Sidebar/>
            </Box>
            <Box
                sx={{
                    flexBasis: {
                        xs: "100%",
                        md: sidebarExpanded ? '70%' : '90%',
                        lg: sidebarExpanded ? '75%' : '95%'
                    },
                    minHeight: "100vh",
                    backgroundColor: "background.default"
                }}>
                <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
                    <Box sx={{pb:{xs: 6, lg: 0}}}>
                        <Header/>
                    </Box>
                    <Box sx={{flexGrow: 1}}>
                        <Box sx={{ maxWidth: {xs: "100vw", md: "100%"}}}>
                            {children}
                        </Box>
                        <Box
                            sx={{display: {xs: "block", lg: "none"}, position: "fixed", bottom: 0, left: 0, right: 0
                        }}>
                            <MobileBottomNavigation/>
                        </Box>
                    </Box>
                </Box>
                <SwipeableDrawer
                    onClose={() => dispatch(UI_ACTION_CREATORS.toggleDrawer(false))}
                    onOpen={() => dispatch(UI_ACTION_CREATORS.toggleDrawer(true))}
                    open={drawerOpen}>
                    <MobileDrawer/>
                </SwipeableDrawer>
            </Box>
        </Box>
    )
}

export default Layout;