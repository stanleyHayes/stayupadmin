import React from "react";
import {Box, Button, Container, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box sx={{pt: 10, pb: 10, textAlign: "center"}}>
                <Container maxWidth="sm">
                    <Typography variant="h1" sx={{fontSize: "7rem", fontWeight: 700, color: "text.disabled", lineHeight: 1}}>
                        404
                    </Typography>
                    <Typography variant="h5" sx={{mt: 2, mb: 1}}>Page Not Found</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                        The page you're looking for doesn't exist or has been moved.
                    </Typography>
                    <Box sx={{display: "flex", gap: 2, justifyContent: "center"}}>
                        <Button startIcon={<ArrowBackIcon/>} variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
                        <Button startIcon={<HomeIcon/>} variant="contained" color="secondary" onClick={() => navigate("/")}>Dashboard</Button>
                    </Box>
                </Container>
            </Box>
        </Layout>
    );
};

export default NotFoundPage;
