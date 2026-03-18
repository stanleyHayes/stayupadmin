import React from "react";
import {Box, Button, Container, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {Home, ArrowBack, ExploreOffOutlined} from "@mui/icons-material";
import {motion} from "framer-motion";

const floatAnimation = {
    y: [0, -12, 0],
    transition: {duration: 3.5, repeat: Infinity, ease: "easeInOut"},
};

const pulseRing = {
    scale: [1, 1.25, 1],
    opacity: [0.2, 0.03, 0.2],
    transition: {duration: 3, repeat: Infinity, ease: "easeInOut"},
};

const stagger = {
    animate: {transition: {staggerChildren: 0.15}},
};

const fadeUp = {
    initial: {opacity: 0, y: 24},
    animate: {opacity: 1, y: 0, transition: {duration: 0.6, ease: "easeOut"}},
};

const particles = ["🔍", "❓", "💫"];

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box sx={{pt: {xs: 8, md: 14}, pb: 10}}>
                <Container maxWidth="sm">
                    <Stack
                        component={motion.div}
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                        direction="column"
                        spacing={3}
                        alignItems="center">

                        {/* Animated icon */}
                        <Box component={motion.div} variants={fadeUp} sx={{position: "relative", width: 140, height: 140}}>
                            <Box component={motion.div} animate={pulseRing} sx={{position: "absolute", inset: -16, borderRadius: "50%", border: "2px solid", borderColor: "secondary.main"}}/>
                            <Box component={motion.div} animate={{...pulseRing, transition: {...pulseRing.transition, delay: 0.8}}} sx={{position: "absolute", inset: -28, borderRadius: "50%", border: "1px solid", borderColor: "secondary.light"}}/>
                            <Box
                                component={motion.div}
                                animate={floatAnimation}
                                sx={{
                                    width: 140, height: 140, borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    backgroundColor: "light.secondary", position: "relative",
                                }}>
                                <ExploreOffOutlined sx={{fontSize: 56, color: "secondary.main", opacity: 0.7}}/>
                            </Box>
                            {particles.map((emoji, i) => (
                                <Box
                                    key={i}
                                    component={motion.div}
                                    animate={{
                                        y: [0, -14 - i * 5, 0],
                                        x: [0, (i - 1) * 8, 0],
                                        opacity: [0.3, 1, 0.3],
                                        rotate: [0, (i - 1) * 15, 0],
                                        transition: {duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4},
                                    }}
                                    sx={{
                                        position: "absolute", fontSize: 22,
                                        ...([{top: -6, right: 6}, {bottom: 6, left: -14}, {top: "35%", right: -18}][i]),
                                    }}>
                                    {emoji}
                                </Box>
                            ))}
                        </Box>

                        {/* Big 404 */}
                        <Typography
                            component={motion.div}
                            variants={fadeUp}
                            sx={{
                                fontSize: {xs: 80, md: 120},
                                fontWeight: 900,
                                lineHeight: 1,
                                background: "linear-gradient(135deg, #6366F1 0%, #A78BFA 50%, #C4B5FD 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: -4,
                            }}>
                            404
                        </Typography>

                        {/* Text */}
                        <Stack component={motion.div} variants={fadeUp} spacing={1} alignItems="center">
                            <Typography variant="h5" fontWeight={800} align="center" sx={{letterSpacing: -0.3}}>
                                Page not found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{lineHeight: 1.8, maxWidth: 320}}>
                                The page you're looking for doesn't exist or has been moved to a new location.
                            </Typography>
                        </Stack>

                        {/* Actions */}
                        <Stack component={motion.div} variants={fadeUp} direction={{xs: "column", sm: "row"}} spacing={1.5}>
                            <Button
                                startIcon={<ArrowBack/>}
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                sx={{px: 3, py: 1}}>
                                Go Back
                            </Button>
                            <Button
                                startIcon={<Home/>}
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate("/")}
                                sx={{px: 3, py: 1}}>
                                Dashboard
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default NotFoundPage;
