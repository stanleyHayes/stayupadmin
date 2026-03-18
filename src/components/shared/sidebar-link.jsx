import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUI} from "../../redux/features/ui/ui-slice";
import {Badge, Box, Stack, Typography} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";

const SidebarLink = ({path, label, count, icon, hasBadge = false}) => {

    const {sidebarExpanded} = useSelector(selectUI);
    const {pathname} = useLocation();
    const active = path === pathname;

    return (
        <Link
            to={path}
            style={{textDecoration: "none", width: "100%", display: "block"}}>
            <Box
                component={motion.div}
                whileHover={{x: sidebarExpanded ? 4 : 0, transition: {duration: 0.15}}}
                whileTap={{scale: 0.97}}
                sx={{
                    borderRadius: 1,
                    px: sidebarExpanded ? 1 : 0,
                    py: 0.25,
                    backgroundColor: active ? "light.secondary" : "transparent",
                    transition: "background-color 0.2s ease",
                    "&:hover": {backgroundColor: active ? "light.secondary" : "action.hover"},
                }}>
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
                                        color: active ? "secondary.main" : "text.secondary",
                                        fontSize: 12, textTransform: "none",
                                        fontWeight: active ? 600 : 400,
                                    }}
                                    size="body2">{label}</Typography>
                            </Stack>

                            {hasBadge && count > 0 && (
                                <Box sx={{
                                    minWidth: 20, height: 20, borderRadius: 1, px: 0.5,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    backgroundColor: "secondary.main", color: "#fff",
                                    fontSize: 10, fontWeight: 700,
                                }}>{count > 99 ? "99+" : count}</Box>
                            )}
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
                                <Badge
                                    badgeContent={count}
                                    max={9}
                                    color="error"
                                    sx={{"& .MuiBadge-badge": {fontSize: 9, height: 16, minWidth: 16, fontWeight: 700}}}
                                >{icon}</Badge>
                            ) : icon}
                        </Stack>
                    )}
                </AnimatePresence>
            </Box>
        </Link>
    )
}

export default SidebarLink;
