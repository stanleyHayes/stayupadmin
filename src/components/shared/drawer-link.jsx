import {Link, useLocation} from "react-router-dom";
import {Box, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import {useDispatch} from "react-redux";

const DrawerLink = ({path, label, count, icon, hasBadge = false}) => {
    const {pathname} = useLocation();
    const dispatch = useDispatch();
    const active = path === pathname || (path !== "/" && pathname.startsWith(path));

    return (
        <Link
            onClick={() => dispatch(UI_ACTION_CREATORS.toggleDrawer(false))}
            to={path}
            style={{textDecoration: "none", display: "block"}}>
            <Box
                component={motion.div}
                whileTap={{scale: 0.98}}
                sx={{
                    px: 1.5, py: 1,
                    backgroundColor: active ? "light.secondary" : "transparent",
                    borderLeft: 3,
                    borderColor: active ? "secondary.main" : "transparent",
                    transition: "all 0.15s ease",
                    "&:hover": {backgroundColor: active ? "light.secondary" : "action.hover"},
                }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{
                            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                            color: active ? "secondary.main" : "text.secondary",
                            transition: "all 0.15s",
                        }}>
                            {icon}
                        </Box>
                        <Typography sx={{
                            color: active ? "secondary.main" : "text.primary",
                            fontSize: 13,
                            fontWeight: active ? 600 : 400,
                            letterSpacing: 0.1,
                        }}>{label}</Typography>
                    </Stack>
                    {hasBadge && count > 0 && (
                        <Box sx={{
                            minWidth: 20, height: 20, px: 0.5,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            backgroundColor: "secondary.main", color: "#fff",
                            fontSize: 10, fontWeight: 700,
                        }}>{count > 99 ? "99+" : count}</Box>
                    )}
                </Stack>
            </Box>
        </Link>
    );
};

export default DrawerLink;
