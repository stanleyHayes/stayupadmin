import {Avatar, Badge, Box, CardMedia, Stack, Toolbar, Typography} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";
import {DarkModeOutlined, LightModeOutlined, Menu, NotificationsOutlined} from "@mui/icons-material";
import {selectUI, UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import logo from "../../assets/images/logo/logo_image.png";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

const iconBtn = {
    padding: 0.6,
    fontSize: 28,
    borderRadius: 1,
    color: "text.secondary",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
        backgroundColor: "light.secondary",
        color: "secondary.main",
    },
};

const MobileHeader = () => {
    const dispatch = useDispatch();
    const {theme} = useSelector(selectUI);
    const {user} = useSelector(selectAuth);

    const initials = user?.first_name && user?.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : "A";

    return (
        <Toolbar
            variant="dense"
            sx={{
                backgroundColor: theme === "dark" ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "divider",
                position: "fixed", top: 0, right: 0, left: 0, width: "100%",
                zIndex: 1100,
                px: 2,
                minHeight: "52px !important",
            }}>
            <Stack sx={{width: "100%"}} direction="row" justifyContent="space-between" alignItems="center">
                {/* Left — Logo + Brand */}
                <Link to="/" style={{textDecoration: "none"}}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CardMedia component="img" sx={{width: 28, height: 28, objectFit: "contain"}} alt="Logo" src={logo}/>
                        <Typography sx={{color: "secondary.main", fontSize: 16, fontWeight: 800, letterSpacing: -0.5}}>StayUp</Typography>
                    </Stack>
                </Link>

                {/* Right — Actions */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Link to="/profile" style={{textDecoration: "none"}}>
                        <Avatar src={user?.avatar_url || user?.image} sx={{width: 28, height: 28, fontSize: 10, fontWeight: 700, bgcolor: "secondary.main", color: "#fff"}}>
                            {initials}
                        </Avatar>
                    </Link>

                    <Badge badgeContent={5} variant="dot" max={10} color="error"
                        sx={{"& .MuiBadge-dot": {width: 6, height: 6, borderRadius: "50%", border: "1.5px solid", borderColor: "background.paper"}}}>
                        <NotificationsOutlined sx={iconBtn}/>
                    </Badge>

                    <AnimatePresence mode="wait">
                        {theme === "dark" ? (
                            <Box key="light" component={motion.div} initial={{scale: 0.5}} animate={{scale: 1}} exit={{scale: 0.5}} transition={{duration: 0.15}}>
                                <LightModeOutlined sx={iconBtn} onClick={() => dispatch(UI_ACTION_CREATORS.toggleTheme())}/>
                            </Box>
                        ) : (
                            <Box key="dark" component={motion.div} initial={{scale: 0.5}} animate={{scale: 1}} exit={{scale: 0.5}} transition={{duration: 0.15}}>
                                <DarkModeOutlined sx={iconBtn} onClick={() => dispatch(UI_ACTION_CREATORS.toggleTheme())}/>
                            </Box>
                        )}
                    </AnimatePresence>

                    <Box
                        onClick={() => dispatch(UI_ACTION_CREATORS.toggleDrawer(true))}
                        sx={{
                            width: 32, height: 32, borderRadius: 1,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            backgroundColor: "light.secondary", cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <Menu sx={{fontSize: 18, color: "secondary.main"}}/>
                    </Box>
                </Stack>
            </Stack>
        </Toolbar>
    );
};

export default MobileHeader;
