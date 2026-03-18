import React, {useState} from "react";
import {
    Alert, Box, Button, CardMedia, Container, Divider, Grid,
    Stack, TextField, Typography
} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginUser} from "../../redux/features/authentication/authentication-slice";
import {VisibilityOffOutlined, VisibilityOutlined, LockOutlined} from "@mui/icons-material";
import logo from "../../assets/images/logo/logo_image.png";
import {motion} from "framer-motion";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formik = useFormik({
        initialValues: {email: "", password: ""},
        validationSchema: yup.object({
            email: yup.string().email("Enter a valid email").required("Email is required"),
            password: yup.string().required("Password is required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setLoading(true);
            setError(null);
            try {
                const result = await dispatch(loginUser(values));
                if (result.error) {
                    setError(result.payload || "Login failed");
                } else {
                    navigate("/");
                }
            } catch {
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
                setSubmitting(false);
            }
        }
    });

    return (
        <Box sx={{minHeight: "100vh", display: "flex", backgroundColor: "background.default"}}>
            {/* Left — Branding Panel */}
            <Box sx={{
                display: {xs: "none", md: "flex"}, flexBasis: "45%",
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
                flexDirection: "column", justifyContent: "center", alignItems: "center",
                p: 6, position: "relative", overflow: "hidden",
            }}>
                <Box sx={{position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: 1, backgroundColor: "rgba(255,255,255,0.06)"}}/>
                <Box sx={{position: "absolute", bottom: -80, left: -40, width: 250, height: 250, borderRadius: 1, backgroundColor: "rgba(255,255,255,0.04)"}}/>
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.6}}>
                    <Stack spacing={3} alignItems="center" sx={{position: "relative", zIndex: 1}}>
                        <CardMedia component="img" src={logo} sx={{width: 120, height: 120, objectFit: "contain"}}/>
                        <Typography sx={{color: "#fff", fontSize: 32, fontWeight: 800, letterSpacing: -0.5}}>StayUp</Typography>
                        <Typography sx={{color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 300, fontSize: 14}}>
                            Manage your store, track orders, and grow your business — all from one place.
                        </Typography>
                    </Stack>
                </motion.div>
            </Box>

            {/* Right — Login Form */}
            <Box sx={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: {xs: 3, sm: 6}}}>
                <Container maxWidth="sm">
                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                        {/* Mobile Logo */}
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 4, display: {xs: "flex", md: "none"}}}>
                            <CardMedia component="img" src={logo} sx={{width: 32, height: 32, objectFit: "contain"}}/>
                            <Typography sx={{color: "secondary.main", fontSize: 20, fontWeight: 800}}>StayUp</Typography>
                        </Stack>

                        <Box sx={{mb: 1}}>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: 1, mb: 2,
                                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <LockOutlined sx={{color: "#fff", fontSize: 22}}/>
                            </Box>
                            <Typography variant="h4" sx={{fontWeight: 800, mb: 0.5}}>Welcome back</Typography>
                            <Typography variant="body2" color="text.secondary">Sign in to your admin account to continue</Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                        <form onSubmit={formik.handleSubmit}>
                            <Stack spacing={2.5} sx={{mt: 3}}>
                                <TextField
                                    name="email" label="Email" fullWidth size="small"
                                    type="email"
                                    value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    error={Boolean(formik.touched.email && formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    placeholder="Enter your email"
                                />
                                <TextField
                                    name="password" label="Password" fullWidth size="small"
                                    type={showPassword ? "text" : "password"}
                                    value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    error={Boolean(formik.touched.password && formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    placeholder="Enter your password"
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <Box sx={{cursor: "pointer", display: "flex", color: "text.secondary"}} onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <VisibilityOffOutlined sx={{fontSize: 18}}/> : <VisibilityOutlined sx={{fontSize: 18}}/>}
                                                </Box>
                                            )
                                        }
                                    }}
                                />
                                <Stack direction="row" justifyContent="flex-end">
                                    <Link to="/auth/forgot-password" style={{textDecoration: "none"}}>
                                        <Typography variant="caption" sx={{color: "secondary.main", fontWeight: 600}}>Forgot password?</Typography>
                                    </Link>
                                </Stack>
                                <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={loading} sx={{py: 1.25}}>
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>
                            </Stack>
                        </form>

                        <Divider sx={{my: 3}}/>

                        <Typography align="center" variant="body2" color="text.secondary">
                            Have an invitation token?{" "}
                            <Link to="/auth/invite/redeem" style={{textDecoration: "none"}}>
                                <Typography variant="body2" component="span" sx={{color: "secondary.main", fontWeight: 600}}>Redeem here</Typography>
                            </Link>
                        </Typography>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default LoginPage;
