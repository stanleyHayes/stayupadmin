import {Badge, Box, CardMedia, Grid, Stack, Toolbar, Typography} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";
import {DarkModeOutlined, LightModeOutlined, Menu, NotificationsOutlined} from "@mui/icons-material";
import {selectUI, UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import logo from "../../assets/images/logo/logo_text.png";
import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {Link} from "react-router-dom";

const MobileHeader = () => {

    const dispatch = useDispatch();
    const {theme} = useSelector(selectUI);

    return (
        <Toolbar
            variant="regular"
            sx={{
                backgroundColor: "background.transparent",
                backdropFilter: "blur(35.5px)",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "divider",
                position: "fixed", top: 0, right: 0, left: 0, width: '100%'
            }}>
            <Grid sx={{width: '100%'}} container={true} justifyContent="space-between" alignItems="center">
                <Grid size={{xs: 'auto'}}>
                    <Stack spacing={3} direction="row" alignItems="center">
                        <Link to="/" style={{textDecoration: "none"}}>
                            <CardMedia
                                component="img"
                                sx={{width: 50, height: 50, objectFit: "contain"}}
                                alt="Logo"
                                src={logo}
                            />
                        </Link>
                    </Stack>
                </Grid>
                <Grid size={{xs: 'auto'}}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Badge badgeContent={5} variant="dot" max={10} color="secondary">
                            <NotificationsOutlined
                                sx={{
                                    padding: 0.5,
                                    fontSize: 32,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderRadius: '100%',
                                    borderColor: "light.secondary",
                                    color: "secondary.main",
                                    backgroundColor: "light.secondary",
                                }}
                            />
                        </Badge>
                        <Box>
                            <AnimatePresence>
                                {theme === 'dark' && (
                                    <Box component={motion.div} exit={{}}>
                                        <LightModeOutlined
                                            sx={{
                                                padding: 0.5,
                                                fontSize: 32,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.secondary",
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                                cursor: "pointer",
                                                mt: 1
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
                                                padding: 0.5,
                                                fontSize: 32,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.secondary",
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                                cursor: "pointer",
                                                mt: 1
                                            }}
                                            onClick={() => dispatch(UI_ACTION_CREATORS.toggleTheme())}
                                        />
                                    </Box>
                                )}
                            </AnimatePresence>
                        </Box>
                        <Box component={motion.div} exit={{}}>
                            <Menu
                                sx={{
                                    padding: 0.5,
                                    fontSize: 32,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderRadius: '100%',
                                    borderColor: "light.secondary",
                                    color: "secondary.main",
                                    backgroundColor: "light.secondary",
                                    cursor: "pointer",
                                    mt: 1
                                }}
                                onClick={() => dispatch(UI_ACTION_CREATORS.toggleDrawer(true))}
                            />
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Toolbar>
    )
}

export default MobileHeader;