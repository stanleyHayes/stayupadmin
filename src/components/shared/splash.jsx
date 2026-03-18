import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import logo from "../../assets/images/logo/logo_image.png";

const pulse = keyframes`
    0%, 100% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.08); opacity: 1; }
`;

const fadeIn = keyframes`
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Splash = () => (
    <Box sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        position: "relative",
        overflow: "hidden",
    }}>
        {/* Background gradient orbs */}
        <Box sx={{
            position: "absolute",
            width: 300, height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            top: "10%", left: "15%",
            filter: "blur(60px)",
        }} />
        <Box sx={{
            position: "absolute",
            width: 250, height: 250,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            bottom: "15%", right: "10%",
            filter: "blur(60px)",
        }} />

        {/* Logo */}
        <Box sx={{
            animation: `${pulse} 2s ease-in-out infinite`,
            mb: 3,
        }}>
            <Box
                component="img"
                src={logo}
                alt="StayUp"
                sx={{
                    width: 80, height: 80,
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 20px rgba(99,102,241,0.3))",
                }}
            />
        </Box>

        {/* Brand name */}
        <Typography sx={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: -0.5,
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: `${fadeIn} 0.6s ease-out 0.2s both`,
            mb: 1,
        }}>
            StayUp
        </Typography>

        {/* Subtitle */}
        <Typography variant="body2" sx={{
            color: "text.secondary",
            animation: `${fadeIn} 0.6s ease-out 0.4s both`,
            mb: 4,
            fontSize: 13,
        }}>
            Admin Dashboard
        </Typography>

        {/* Spinner */}
        <Box sx={{
            animation: `${fadeIn} 0.6s ease-out 0.6s both`,
        }}>
            <Box sx={{
                width: 32, height: 32,
                border: "3px solid",
                borderColor: "divider",
                borderTopColor: "secondary.main",
                borderRadius: "50%",
                animation: `${spin} 0.8s linear infinite`,
            }} />
        </Box>

        {/* Bottom shimmer bar */}
        <Box sx={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: `${shimmer} 1.5s ease-in-out infinite`,
        }} />
    </Box>
);

export default Splash;
