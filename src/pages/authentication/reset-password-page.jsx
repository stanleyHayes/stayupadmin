import React, {useState} from "react";
import {Alert, Box, Button, CardMedia, Container, Stack, TextField, Typography} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import {LockResetOutlined, VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";
import logo from "../../assets/images/logo/logo_image.png";
import {motion} from "framer-motion";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {password: "", confirmPassword: ""},
        validationSchema: yup.object({
            password: yup.string().min(8, "Min 8 characters").required("Password is required"),
            confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
        }),
        onSubmit: async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 800));
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate("/auth/login"), 2000);
        }
    });

    return (
        <Box sx={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "background.default", p: 3}}>
            <Container maxWidth="xs">
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                    <Stack spacing={3} alignItems="center">
                        <Link to="/auth/login" style={{textDecoration: "none"}}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <CardMedia component="img" src={logo} sx={{width: 32, height: 32, objectFit: "contain"}}/>
                                <Typography sx={{color: "secondary.main", fontSize: 20, fontWeight: 800}}>StayUp</Typography>
                            </Stack>
                        </Link>

                        <Box sx={{width: 56, height: 56, background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <LockResetOutlined sx={{color: "#fff", fontSize: 28}}/>
                        </Box>

                        <Box sx={{textAlign: "center"}}>
                            <Typography variant="h5" sx={{fontWeight: 800, mb: 0.5}}>Reset password</Typography>
                            <Typography variant="body2" color="text.secondary">Create a strong new password for your account.</Typography>
                        </Box>

                        {success ? (
                            <Alert severity="success" sx={{width: "100%"}}>Password reset successfully. Redirecting to login...</Alert>
                        ) : (
                            <form onSubmit={formik.handleSubmit} style={{width: "100%"}}>
                                <Stack spacing={2.5}>
                                    <TextField
                                        name="password" label="New Password" fullWidth size="small"
                                        type={showPassword ? "text" : "password"}
                                        value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        error={Boolean(formik.touched.password && formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                        slotProps={{input: {endAdornment: <Box sx={{cursor: "pointer", display: "flex", color: "text.secondary"}} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOffOutlined sx={{fontSize: 18}}/> : <VisibilityOutlined sx={{fontSize: 18}}/>}</Box>}}}
                                    />
                                    <TextField name="confirmPassword" label="Confirm Password" fullWidth size="small" type="password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}/>
                                    <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={loading} sx={{py: 1.25}}>
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </Stack>
                            </form>
                        )}
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ResetPasswordPage;
