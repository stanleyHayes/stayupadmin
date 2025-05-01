import {Link, useLocation} from "react-router-dom";
import {Badge, Box, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import {useDispatch} from "react-redux";

const DrawerLink = ({path, label, count, icon, hasBadge = false}) => {

    const {pathname} = useLocation();
    const dispatch = useDispatch();
    const isActive = path => path === pathname;
    return (
        <Link
            onClick={() => dispatch(UI_ACTION_CREATORS.toggleDrawer(false))}
            to={path}
            style={{textDecoration: "none", width: "100%", display: "block"}}>
            <Box
                animate={{}}
                initial={{}}
                whileHover={{}}
                component={motion.div}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                        {icon}
                        <Typography
                            sx={{
                                color: isActive(path) ? "secondary.main" : "text.secondary",
                                fontSize: 12, textTransform: "uppercase"
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