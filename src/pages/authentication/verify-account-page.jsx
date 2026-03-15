import React, {useEffect, useState} from "react";
import {Alert, Box, Button, CardMedia, CircularProgress, Container, Stack, Typography} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {CheckCircleOutline, ErrorOutline} from "@mui/icons-material";
import logo from "../../assets/images/logo/logo_image.png";
import {motion} from "framer-motion";

const VerifyAccountPage = () => {
    const {token} = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying | success | error

    useEffect(() => {
        const verify = async () => {
            await new Promise(r => setTimeout(r, 1500));
            if (token && token.length > 5) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        };
        verify();
    }, [token]);

    return (
        <Box sx={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "background.default", p: 3}}>
            <Container maxWidth="xs">
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                    <Stack spacing={3} alignItems="center">
                        <Link to="/" style={{textDecoration: "none"}}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <CardMedia component="img" src={logo} sx={{width: 32, height: 32, objectFit: "contain"}}/>
                                <Typography sx={{color: "secondary.main", fontSize: 20, fontWeight: 800}}>StayUp</Typography>
                            </Stack>
                        </Link>

                        {status === "verifying" && (
                            <>
                                <CircularProgress color="secondary" size={48}/>
                                <Typography variant="h6" sx={{fontWeight: 700}}>Verifying your account...</Typography>
                                <Typography variant="body2" color="text.secondary" align="center">Please wait while we confirm your email.</Typography>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <Box sx={{width: 64, height: 64, background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <CheckCircleOutline sx={{color: "#fff", fontSize: 32}}/>
                                </Box>
                                <Typography variant="h5" sx={{fontWeight: 800}}>Account verified</Typography>
                                <Typography variant="body2" color="text.secondary" align="center">Your email has been confirmed. You can now sign in.</Typography>
                                <Button variant="contained" color="secondary" size="large" fullWidth sx={{py: 1.25}} onClick={() => navigate("/auth/login")}>
                                    Go to Sign In
                                </Button>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <Box sx={{width: 64, height: 64, background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <ErrorOutline sx={{color: "#fff", fontSize: 32}}/>
                                </Box>
                                <Typography variant="h5" sx={{fontWeight: 800}}>Verification failed</Typography>
                                <Typography variant="body2" color="text.secondary" align="center">This verification link is invalid or has expired.</Typography>
                                <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate("/auth/login")}>
                                    Back to Sign In
                                </Button>
                            </>
                        )}
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
};

export default VerifyAccountPage;
