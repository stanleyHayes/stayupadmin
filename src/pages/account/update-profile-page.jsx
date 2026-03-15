import React, {useState} from "react";
import {
    Alert, Avatar, Box, Button, Container, Divider,
    Grid, LinearProgress, Paper, Snackbar, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectAuth, updateUser} from "../../redux/features/authentication/authentication-slice";
import {ArrowBack, SaveOutlined, CameraAltOutlined} from "@mui/icons-material";
import {useFormik} from "formik";
import * as Yup from "yup";

const UpdateProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(selectAuth);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            username: user?.username || "",
            phone: user?.phone || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            firstName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            username: Yup.string().required("Username is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 600));
            dispatch(updateUser(values));
            setLoading(false);
            setSaved(true);
        }
    });

    const initials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : "AD";

    const field = (name, label, opts = {}) => (
        <TextField
            name={name}
            label={label}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched[name] && formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            size="small"
            fullWidth
            {...opts}
        />
    );

    return (
        <Layout>
            {loading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" color="inherit">Back</Button>
                            <Typography variant="h5" sx={{fontWeight: 700}}>Edit Profile</Typography>
                        </Stack>
                        <Button
                            startIcon={<SaveOutlined/>}
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={formik.handleSubmit}
                            disabled={loading || !formik.dirty}
                        >
                            {formik.dirty ? "Save Changes" : "No Changes"}
                        </Button>
                    </Stack>

                    <Divider sx={{mb: 3}}/>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Left - Avatar & Actions */}
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                    <Box sx={{position: "relative", display: "inline-block", mb: 2}}>
                                        <Avatar
                                            src={user?.image}
                                            sx={{
                                                width: 100, height: 100, fontSize: 32, fontWeight: 700,
                                                bgcolor: "secondary.main", color: "#fff"
                                            }}>
                                            {initials}
                                        </Avatar>
                                        <Box sx={{
                                            position: "absolute", bottom: 0, right: 0,
                                            width: 32, height: 32, borderRadius: 0,
                                            backgroundColor: "secondary.main", color: "#fff",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            border: "3px solid", borderColor: "background.paper",
                                            cursor: "pointer"
                                        }}>
                                            <CameraAltOutlined sx={{fontSize: 14}}/>
                                        </Box>
                                    </Box>
                                    <Typography variant="subtitle2" sx={{fontWeight: 600}}>{user?.firstName} {user?.lastName}</Typography>
                                    <Typography variant="caption" color="text.secondary">@{user?.username}</Typography>

                                    <Divider sx={{my: 2}}/>

                                    <Typography variant="caption" color="text.secondary" sx={{display: "block", mb: 1.5, textAlign: "left"}}>
                                        Update your personal information. Changes will be reflected across the dashboard.
                                    </Typography>

                                    <Stack spacing={1.5}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            disabled={loading || !formik.dirty}
                                            startIcon={<SaveOutlined/>}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button variant="outlined" color="inherit" fullWidth onClick={() => navigate("/profile")}>
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Grid>

                            {/* Right - Form Fields */}
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600, mb: 2, color: "text.secondary",
                                        textTransform: "uppercase", fontSize: 11, letterSpacing: 1
                                    }}>
                                        Personal Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            {field("firstName", "First Name")}
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            {field("lastName", "Last Name")}
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            {field("email", "Email Address", {type: "email"})}
                                        </Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600, mb: 2, color: "text.secondary",
                                        textTransform: "uppercase", fontSize: 11, letterSpacing: 1
                                    }}>
                                        Account Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            {field("username", "Username")}
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            {field("phone", "Phone Number")}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>

            <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                <Alert severity="success" onClose={() => setSaved(false)} sx={{width: "100%"}}>
                    Profile updated successfully
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default UpdateProfilePage;
