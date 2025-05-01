import {Badge, Box, Divider, Stack, Toolbar, Typography} from "@mui/material";
import {
    Close,
    DarkModeOutlined,
    GridOn,
    LightModeOutlined,
    ListAlt,
    Menu,
    NotificationsOutlined
} from "@mui/icons-material";
import {selectUI, UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import {useDispatch, useSelector} from "react-redux";
import ProfileDropdown from "../shared/profile-dropdown.jsx";
import {AnimatePresence, motion} from "framer-motion";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";


const DesktopHeader = () => {

    const dispatch = useDispatch();
    const {sidebarExpanded, theme, view} = useSelector(selectUI);
    const {user} = useSelector(selectAuth);

    return (
        <Toolbar
            sx={{
                backgroundColor: theme === 'dark' ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(40px)",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "divider",
                // py: 3.8,
                width: "100%"
            }}
            variant="regular">
            <Stack
                sx={{width: "100%"}}
                direction="row"
                spacing={2}
                container={true}
                justifyContent="space-between"
                alignItems="center">
                <Stack
                    divider={<Divider flexItem={true} variant="middle" orientation="vertical"/>}
                    spacing={2}
                    justifyContent="flex-start"
                    direction="row"
                    alignItems="center">
                    <Box>
                        <AnimatePresence>
                            {sidebarExpanded && (
                                <Box component={motion.div} exit={{}}>
                                    <Close
                                        onClick={() => dispatch(UI_ACTION_CREATORS.toggleSidebar())}
                                        sx={{
                                            padding: 1,
                                            fontSize: 40,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.secondary",
                                            color: "secondary.main",
                                            backgroundColor: "light.secondary",
                                            cursor: "pointer"
                                        }}
                                    />
                                </Box>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {!sidebarExpanded && (
                                <Box component={motion.div} exit={{}}>
                                    <Menu
                                        sx={{
                                            padding: 1,
                                            fontSize: 40,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.secondary",
                                            color: "secondary.main",
                                            backgroundColor: "light.secondary",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => dispatch(UI_ACTION_CREATORS.toggleSidebar())}
                                    />
                                </Box>
                            )}
                        </AnimatePresence>
                    </Box>
                    <Typography variant="body1" sx={{color: "text.secondary", fontWeight: "bold"}}>
                        {`Hello, ${user.firstName}`}
                    </Typography>
                </Stack>


                <Stack
                    divider={<Divider flexItem={true} variant="middle" orientation="vertical"/>}
                    spacing={2}
                    justifyContent="flex-end"
                    direction="row"
                    alignItems="center">
                    <ProfileDropdown/>
                    <Badge badgeContent={5} variant="dot" max={10} color="secondary">
                        <NotificationsOutlined
                            sx={{
                                padding: 1,
                                fontSize: 40,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '100%',
                                borderColor: "light.secondary",
                                color: "secondary.main",
                                backgroundColor: "light.secondary",
                                cursor: "pointer"
                            }}
                        />
                    </Badge>
                    <Box>
                        <AnimatePresence>
                            {theme === 'dark' && (
                                <Box component={motion.div} exit={{}}>
                                    <LightModeOutlined
                                        sx={{
                                            padding: 1,
                                            fontSize: 40,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.secondary",
                                            cursor: "pointer",
                                            color: "secondary.main",
                                            backgroundColor: "light.secondary",
                                        }}
                                        onClick={() => dispatch(UI_ACTION_CREATORS.toggleTheme())}
                                    />
                                </Box>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {theme === 'light' && (
                                <Box component={motion.div} exit={{}}>
                                    <DarkModeOutlined
                                        sx={{
                                            padding: 1,
                                            fontSize: 40,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.secondary",
                                            color: "secondary.main",
                                            backgroundColor: "light.secondary",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => dispatch(UI_ACTION_CREATORS.toggleTheme())}
                                    />
                                </Box>
                            )}
                        </AnimatePresence>
                    </Box>
                    <Box>
                        <AnimatePresence>
                            {view === 'grid' && (
                                <Box component={motion.div} exit={{}}>
                                    <ListAlt
                                        sx={{
                                            padding: 1,
                                            fontSize: 40,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.secondary",
                                            color: "secondary.main",
                                            backgroundColor: "light.secondary",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => dispatch(UI_ACTION_CREATORS.toggleView())}
                                    />
                                </Box>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {view === 'list' && (
                                <Box component={motion.div} exit={{}}>
                                    <GridOn
                                        sx={{
                                            padding: 1,
                                            fontSize: 40,
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.secondary",
                                            color: "secondary.main",
                                            backgroundColor: "light.secondary",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => dispatch(UI_ACTION_CREATORS.toggleView())}
                                    />
                                </Box>
                            )}
                        </AnimatePresence>
                    </Box>
                </Stack>
            </Stack>
        </Toolbar>
    )
}

export default DesktopHeader;