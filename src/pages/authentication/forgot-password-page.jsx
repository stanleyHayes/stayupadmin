import React, {useState} from "react";
import {Alert, Box, Button, CardMedia, Container, Stack, TextField, Typography} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {Link} from "react-router-dom";
import {MailOutlined, ArrowBack} from "@mui/icons-material";
import logo from "../../assets/images/logo/logo_image.png";
import {motion} from "framer-motion";

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const formik = useFormik({
        initialValues: {email: ""},
        validationSchema: yup.object({email: yup.string().email("Enter a valid email").required("Email is required")}),
        onSubmit: async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 800));
            setLoading(false);
            setSent(true);
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
                            <MailOutlined sx={{color: "#fff", fontSize: 28}}/>
                        </Box>

                        <Box sx={{textAlign: "center"}}>
                            <Typography variant="h5" sx={{fontWeight: 800, mb: 0.5}}>Forgot password?</Typography>
                            <Typography variant="body2" color="text.secondary">Enter your email and we'll send you a reset link.</Typography>
                        </Box>

                        {sent ? (
                            <Alert severity="success" sx={{width: "100%"}}>Password reset link sent. Check your inbox.</Alert>
                        ) : (
                            <form onSubmit={formik.handleSubmit} style={{width: "100%"}}>
                                <Stack spacing={2.5}>
                                    <TextField name="email" label="Email Address" fullWidth size="small" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.email && formik.errors.email)} helperText={formik.touched.email && formik.errors.email} placeholder="admin@stayup.com"/>
                                    <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={loading} sx={{py: 1.25}}>
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                </Stack>
                            </form>
                        )}

                        <Link to="/auth/login" style={{textDecoration: "none"}}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <ArrowBack sx={{fontSize: 14, color: "secondary.main"}}/>
                                <Typography variant="body2" sx={{color: "secondary.main", fontWeight: 600}}>Back to sign in</Typography>
                            </Stack>
                        </Link>
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ForgotPasswordPage;
