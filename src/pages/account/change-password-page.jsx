import React, {useState} from "react";
import {
    Alert, Avatar, Box, Button, Container, Divider, Grid,
    LinearProgress, Paper, Snackbar, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import {
    ArrowBack, LockOutlined, VisibilityOutlined, VisibilityOffOutlined,
    CheckCircleOutline, ShieldOutlined, KeyOutlined
} from "@mui/icons-material";
import {useFormik} from "formik";
import * as Yup from "yup";

const PasswordField = ({name, label, formik, placeholder}) => {
    const [show, setShow] = useState(false);
    return (
        <TextField
            name={name}
            label={label}
            type={show ? "text" : "password"}
            placeholder={placeholder}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched[name] && formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            size="small"
            fullWidth
            slotProps={{
                input: {
                    endAdornment: (
                        <Box sx={{cursor: "pointer", display: "flex", color: "text.secondary"}} onClick={() => setShow(!show)}>
                            {show ? <VisibilityOffOutlined sx={{fontSize: 18}}/> : <VisibilityOutlined sx={{fontSize: 18}}/>}
                        </Box>
                    )
                }
            }}
        />
    );
};

const Requirement = ({met, label}) => (
    <Stack direction="row" spacing={1} alignItems="center">
        <CheckCircleOutline sx={{fontSize: 16, color: met ? "text.green" : "text.disabled"}}/>
        <Typography variant="caption" sx={{color: met ? "text.green" : "text.secondary"}}>{label}</Typography>
    </Stack>
);

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const {user} = useSelector(selectAuth);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const formik = useFormik({
        initialValues: {current_password: "", new_password: "", confirm_password: ""},
        validationSchema: Yup.object({
            current_password: Yup.string().required("Current password is required"),
            new_password: Yup.string().min(8, "Min 8 characters").required("New password is required"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("new_password")], "Passwords do not match")
                .required("Please confirm your new password"),
        }),
        onSubmit: async (values, {resetForm}) => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 800));
            setLoading(false);
            setSaved(true);
            resetForm();
        }
    });

    const pw = formik.values.new_password;
    const hasLength = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const strengthCount = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    const strengthLabel = strengthCount <= 1 ? "Weak" : strengthCount <= 3 ? "Fair" : strengthCount <= 4 ? "Strong" : "Excellent";
    const strengthColor = strengthCount <= 1 ? "#EF4444" : strengthCount <= 3 ? "#F59E0B" : strengthCount <= 4 ? "#3B82F6" : "#22C55E";

    const initials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : "AD";

    return (
        <Layout>
            {loading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    {/* Header */}
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" color="inherit">Back</Button>
                        <Typography variant="h5" sx={{fontWeight: 700}}>Change Password</Typography>
                    </Stack>

                    <Divider sx={{mb: 3}}/>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3} justifyContent="center">
                            {/* Left - Form */}
                            <Grid size={{xs: 12, md: 7}}>
                                <Paper elevation={0} sx={{overflow: "hidden"}}>
                                    {/* Banner */}
                                    <Box sx={{
                                        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                                        p: 3, display: "flex", alignItems: "center", gap: 2
                                    }}>
                                        <Box sx={{
                                            width: 48, height: 48, borderRadius: "14px",
                                            backgroundColor: "rgba(255,255,255,0.15)",
                                            display: "flex", alignItems: "center", justifyContent: "center"
                                        }}>
                                            <LockOutlined sx={{color: "#fff", fontSize: 24}}/>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{color: "#fff", fontWeight: 700}}>Update Your Password</Typography>
                                            <Typography variant="body2" sx={{color: "rgba(255,255,255,0.75)", fontSize: 12}}>
                                                Choose a strong password to keep your account secure
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{p: 3}}>
                                        <Stack spacing={3}>
                                            {/* Current Password */}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 600, fontSize: 12, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5}}>
                                                    Current Password
                                                </Typography>
                                                <PasswordField name="current_password" label="Enter current password" placeholder="Your existing password" formik={formik}/>
                                            </Box>

                                            <Divider/>

                                            {/* New Password */}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 600, fontSize: 12, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5}}>
                                                    New Password
                                                </Typography>
                                                <PasswordField name="new_password" label="Enter new password" placeholder="At least 8 characters" formik={formik}/>

                                                {/* Strength Meter */}
                                                {pw.length > 0 && (
                                                    <Box sx={{mt: 1.5}}>
                                                        <Stack direction="row" spacing={0.5} sx={{mb: 1}}>
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <Box key={i} sx={{
                                                                    flex: 1, height: 4, borderRadius: 0,
                                                                    backgroundColor: i <= strengthCount ? strengthColor : "divider",
                                                                    transition: "all 0.3s"
                                                                }}/>
                                                            ))}
                                                        </Stack>
                                                        <Typography variant="caption" sx={{color: strengthColor, fontWeight: 600, fontSize: 11}}>
                                                            {strengthLabel}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Confirm Password */}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 600, fontSize: 12, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5}}>
                                                    Confirm New Password
                                                </Typography>
                                                <PasswordField name="confirm_password" label="Confirm new password" placeholder="Re-enter new password" formik={formik}/>
                                            </Box>
                                        </Stack>

                                        <Divider sx={{my: 3}}/>

                                        <Stack direction={{xs: "column", sm: "row"}} spacing={1.5}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                disabled={loading || !formik.dirty}
                                                startIcon={<LockOutlined/>}
                                                sx={{flex: 1}}
                                            >
                                                {loading ? "Updating..." : "Change Password"}
                                            </Button>
                                            <Button variant="outlined" color="inherit" onClick={() => navigate("/profile")} sx={{flex: 1}}>
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Right - Info Sidebar */}
                            <Grid size={{xs: 12, md: 5}}>
                                {/* Account Info */}
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2}}>
                                        <Avatar
                                            src={user?.image}
                                            sx={{width: 44, height: 44, bgcolor: "secondary.main", color: "#fff", fontSize: 16, fontWeight: 700}}>
                                            {initials}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{fontWeight: 600}}>{user?.firstName} {user?.lastName}</Typography>
                                            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                                        </Box>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        Changing the password for this account. Make sure to use a password you haven't used before.
                                    </Typography>
                                </Paper>

                                {/* Password Requirements */}
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 2}}>
                                        <ShieldOutlined sx={{fontSize: 18, color: "secondary.main"}}/>
                                        <Typography variant="subtitle2" sx={{fontWeight: 600}}>Password Requirements</Typography>
                                    </Stack>
                                    <Stack spacing={1}>
                                        <Requirement met={hasLength} label="At least 8 characters"/>
                                        <Requirement met={hasUpper} label="One uppercase letter (A-Z)"/>
                                        <Requirement met={hasLower} label="One lowercase letter (a-z)"/>
                                        <Requirement met={hasNumber} label="One number (0-9)"/>
                                        <Requirement met={hasSpecial} label="One special character (!@#$...)"/>
                                    </Stack>
                                </Paper>

                                {/* Security Tips */}
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 2}}>
                                        <KeyOutlined sx={{fontSize: 18, color: "text.orange"}}/>
                                        <Typography variant="subtitle2" sx={{fontWeight: 600}}>Security Tips</Typography>
                                    </Stack>
                                    <Stack spacing={1.5}>
                                        {[
                                            "Don't reuse passwords from other accounts",
                                            "Use a mix of letters, numbers, and symbols",
                                            "Avoid personal info like birthdays or names",
                                            "Consider using a password manager",
                                        ].map((tip, i) => (
                                            <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                                                <Box sx={{
                                                    width: 6, height: 6, borderRadius: 0, mt: 0.75, flexShrink: 0,
                                                    backgroundColor: "secondary.main"
                                                }}/>
                                                <Typography variant="caption" color="text.secondary">{tip}</Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>

            <Snackbar open={saved} autoHideDuration={4000} onClose={() => setSaved(false)} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                <Alert severity="success" onClose={() => setSaved(false)} sx={{width: "100%"}}>
                    Password changed successfully
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default ChangePasswordPage;
