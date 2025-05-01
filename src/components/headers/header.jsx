import {AppBar, Box} from "@mui/material";
import DesktopHeader from "./desktop-header.jsx";
import MobileHeader from "./mobile-header.jsx";

const Header = () => {
    return (
        <Box>
            <Box sx={{display: {xs: "none", lg: "block"}}}>
                <DesktopHeader/>
            </Box>

            <Box sx={{display: {xs: "block", lg: "none"}}}>
                <MobileHeader/>
            </Box>
        </Box>
    )
}

export default Header;