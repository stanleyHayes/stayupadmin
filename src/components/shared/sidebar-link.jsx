import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUI} from "../../redux/features/ui/ui-slice";
import {Badge, Box, Stack, Typography} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";

const SidebarLink = ({path, label, count, icon, hasBadge = false}) => {

    const {sidebarExpanded} = useSelector(selectUI);
    const {pathname} = useLocation();
    const isActive = path => path === pathname;
    return (
        <Link
            to={path}
            style={{textDecoration: "none", width: "100%", display: "block"}}>
            <Box
                animate={{}}
                initial={{}}
                whileHover={{}}
                component={motion.div}>
                <AnimatePresence
                    initial={true}
                    presenceAffectsLayout={true}
                    mode="wait">
                    {sidebarExpanded && (
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" spacing={2} alignItems="center">
                                {icon}
                                <Typography
                                    sx={{
                                        color: isActive(path) ? "secondary.main" : "text.secondary",
                                        fontSize: 12, textTransform: "none"
                                    }}
                                    size="body2">{label}</Typography>
                            </Stack>

                            {hasBadge && count > 0 && (<Badge variant="standard" max={9} badgeContent={count}/>)}
                        </Stack>
                    )}
                </AnimatePresence>
                <AnimatePresence
                    initial={true}
                    presenceAffectsLayout={true}
                    mode="wait">
                    {!sidebarExpanded && (
                        <Stack
                            direction="row"
                            justifyContent="center"
                            component={motion.div}
                            exit={{}}>
                            {hasBadge && count > 0 ? (
                                <Badge variant="dot" badgeContent={count}>{icon}</Badge>
                            ) : icon}
                        </Stack>
                    )}
                </AnimatePresence>
            </Box>
        </Link>
    )
}

export default SidebarLink;