import {Link, useLocation} from "react-router-dom";
import {Box, Stack, Typography} from "@mui/material";
import {ChevronRight} from "@mui/icons-material";
import {motion} from "framer-motion";

const DropdownLink = ({path, icon, label}) => {

    const {pathname} = useLocation();
    const isActive = path => path === pathname;

    return (
        <Box
            component={motion.div}
            sx={{
                "&:hover":{
                    backgroundColor: "light.secondary",
                    transition: "all 300ms ease-out",
                },
                borderRadius: 1,
                p: 0.5
            }}>
            <Link to={path} style={{textDecoration: "none", display: "block", width: "100%"}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                        {icon}
                        <Typography
                            sx={{
                                color: isActive(path) ? "secondary.main" : "text.secondary",
                                fontSize: 12, textTransform: "none"
                            }}
                            size="body2">{label}</Typography>
                    </Stack>
                    <ChevronRight sx={{color: "icon.default", fontSize: 16}}/>
                </Stack>
            </Link>
        </Box>
    )
}

export default DropdownLink;