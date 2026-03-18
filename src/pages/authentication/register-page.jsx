import React, {useState} from "react";
import {
    Alert, Box, Button, CardMedia, Checkbox, Container, Divider,
    FormControlLabel, Stack, TextField, Typography
} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../../redux/features/authentication/authentication-slice";
import {VisibilityOffOutlined, VisibilityOutlined, PersonAddOutlined} from "@mui/icons-material";
import logo from "../../assets/images/logo/logo_image.png";
import {motion} from "framer-motion";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {first_name: "", last_name: "", email: "", username: "", password: "", confirmPassword: "", terms: false},
        validationSchema: yup.object({
            first_name: yup.string().required("First name is required"),
            last_name: yup.string().required("Last name is required"),
            email: yup.string().email("Enter a valid email").required("Email is required"),
            username: yup.string().required("Username is required"),
            password: yup.string().min(8, "Min 8 characters").required("Password is required"),
            confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
            terms: yup.boolean().oneOf([true], "You must accept the terms"),
        }),
        onSubmit: async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 800));
            dispatch(login());
            setLoading(false);
            navigate("/");
        }
    });

    return (
        <Box sx={{minHeight: "100vh", display: "flex", backgroundColor: "background.default"}}>
            {/* Left — Branding */}
            <Box sx={{
                display: {xs: "none", md: "flex"}, flexBasis: "40%",
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
                flexDirection: "column", justifyContent: "center", alignItems: "center",
                p: 6, position: "relative", overflow: "hidden",
            }}>
                <Box sx={{position: "absolute", top: -60, right: -60, width: 200, height: 200, backgroundColor: "rgba(255,255,255,0.06)"}}/>
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.6}}>
                    <Stack spacing={3} alignItems="center" sx={{position: "relative", zIndex: 1}}>
                        <CardMedia component="img" src={logo} sx={{width: 64, height: 64, objectFit: "contain"}}/>
                        <Typography sx={{color: "#fff", fontSize: 32, fontWeight: 800, letterSpacing: -0.5}}>StayUp</Typography>
                        <Typography sx={{color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 300, fontSize: 14}}>
                            Join the admin team and help manage the store.
                        </Typography>
                    </Stack>
                </motion.div>
            </Box>

            {/* Right — Form */}
            <Box sx={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: {xs: 3, sm: 6}, overflowY: "auto"}}>
                <Container maxWidth="sm">
                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 4, display: {xs: "flex", md: "none"}}}>
                            <CardMedia component="img" src={logo} sx={{width: 32, height: 32, objectFit: "contain"}}/>
                            <Typography sx={{color: "secondary.main", fontSize: 20, fontWeight: 800}}>StayUp</Typography>
                        </Stack>

                        <Box sx={{mb: 1}}>
                            <Box sx={{
                                width: 44, height: 44, mb: 2,
                                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <PersonAddOutlined sx={{color: "#fff", fontSize: 22}}/>
                            </Box>
                            <Typography variant="h4" sx={{fontWeight: 800, mb: 0.5}}>Create account</Typography>
                            <Typography variant="body2" color="text.secondary">Set up your admin profile to get started</Typography>
                        </Box>

                        <form onSubmit={formik.handleSubmit}>
                            <Stack spacing={2} sx={{mt: 3}}>
                                <Stack direction="row" spacing={2}>
                                    <TextField name="first_name" label="First Name" fullWidth size="small" value={formik.values.first_name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.first_name && formik.errors.first_name)} helperText={formik.touched.first_name && formik.errors.first_name}/>
                                    <TextField name="last_name" label="Last Name" fullWidth size="small" value={formik.values.last_name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.last_name && formik.errors.last_name)} helperText={formik.touched.last_name && formik.errors.last_name}/>
                                </Stack>
                                <TextField name="email" label="Email Address" fullWidth size="small" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.email && formik.errors.email)} helperText={formik.touched.email && formik.errors.email}/>
                                <TextField name="username" label="Username" fullWidth size="small" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.username && formik.errors.username)} helperText={formik.touched.username && formik.errors.username}/>
                                <TextField
                                    name="password" label="Password" fullWidth size="small"
                                    type={showPassword ? "text" : "password"}
                                    value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    error={Boolean(formik.touched.password && formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    slotProps={{input: {endAdornment: <Box sx={{cursor: "pointer", display: "flex", color: "text.secondary"}} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOffOutlined sx={{fontSize: 18}}/> : <VisibilityOutlined sx={{fontSize: 18}}/>}</Box>}}}
                                />
                                <TextField name="confirmPassword" label="Confirm Password" fullWidth size="small" type="password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}/>

                                <FormControlLabel
                                    control={<Checkbox name="terms" checked={formik.values.terms} onChange={formik.handleChange} color="secondary" size="small"/>}
                                    label={<Typography variant="caption" color="text.secondary">I agree to the <Link to="/terms" style={{textDecoration: "none", color: "#6366F1"}}>Terms</Link> and <Link to="/privacy" style={{textDecoration: "none", color: "#6366F1"}}>Privacy Policy</Link></Typography>}
                                />
                                {formik.touched.terms && formik.errors.terms && <Typography variant="caption" color="error">{formik.errors.terms}</Typography>}

                                <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={loading} sx={{py: 1.25}}>
                                    {loading ? "Creating account..." : "Create Account"}
                                </Button>
                            </Stack>
                        </form>

                        <Divider sx={{my: 3}}/>

                        <Typography align="center" variant="body2" color="text.secondary">
                            Already have an account?{" "}
                            <Link to="/auth/login" style={{textDecoration: "none"}}>
                                <Typography variant="body2" component="span" sx={{color: "secondary.main", fontWeight: 600}}>Sign in</Typography>
                            </Link>
                        </Typography>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default RegisterPage;
