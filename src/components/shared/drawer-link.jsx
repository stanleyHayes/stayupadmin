import {Link, useLocation} from "react-router-dom";
import {Badge, Box, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import {useDispatch} from "react-redux";

const DrawerLink = ({path, label, count, icon, hasBadge = false}) => {

    const {pathname} = useLocation();
    const dispatch = useDispatch();
    const active = path === pathname;

    return (
        <Link
            onClick={() => dispatch(UI_ACTION_CREATORS.toggleDrawer(false))}
            to={path}
            style={{textDecoration: "none", width: "100%", display: "block"}}>
            <Box
                component={motion.div}
                whileHover={{x: 4, transition: {duration: 0.15}}}
                whileTap={{scale: 0.97}}
                sx={{
                    borderRadius: 0,
                    px: 1, py: 0.25,
                    backgroundColor: active ? "light.secondary" : "transparent",
                    transition: "background-color 0.2s ease",
                    "&:hover": {backgroundColor: active ? "light.secondary" : "action.hover"},
                }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                        {icon}
                        <Typography
                            sx={{
                                color: active ? "secondary.main" : "text.secondary",
                                fontSize: 12, textTransform: "uppercase",
                                fontWeight: active ? 600 : 400,
                            }}
                            size="body2">{label}</Typography>
                    </Stack>
                    {hasBadge && count > 0 && (<Badge variant="standard" max={9} badgeContent={count}/>)}
                </Stack>
            </Box>
        </Link>
    )
}

export default DrawerLink;
