import {Box, LinearProgress} from "@mui/material";

const Splash = () => (
    <Box sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
    }}>
        <LinearProgress color="secondary" sx={{position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999}}/>
    </Box>
);

export default Splash;
