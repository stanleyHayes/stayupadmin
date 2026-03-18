import React, {useState} from "react";
import {
    Alert, Avatar, Box, Button, Container, Divider,
    Grid, LinearProgress, Paper, Snackbar, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectAuth, updateUser} from "../../redux/features/authentication/authentication-slice";
import {STAY_UP_ADMIN_CONSTANTS} from "../../utils/constants.js";
import {ArrowBack, SaveOutlined, CameraAltOutlined} from "@mui/icons-material";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";

const UpdateProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(selectAuth);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    const name = user?.display_name || user?.name || (user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "");
    const initials = user?.first_name && user?.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
        : name[0]?.toUpperCase() || "A";

    const formik = useFormik({
        initialValues: {
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            phone: user?.phone || "",
            avatar_url: user?.avatar_url || "",
            email: user?.email || "",
            username: user?.username || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            first_name: Yup.string().required("First name is required"),
            last_name: Yup.string().required("Last name is required"),
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            username: Yup.string().required("Username is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
            try {
                const { first_name, last_name, email, username, phone, avatar_url } = values;
                const { data } = await axios.put(`${STAY_UP_ADMIN_CONSTANTS.STAY_UP_ADMIN_API_BASE}/auth/profile`, { first_name, last_name, email, username, phone, avatar_url });
                dispatch(updateUser(data.data ?? data));
                setSaved(true);
                setTimeout(() => navigate("/profile"), 1200);
            } catch (err) {
                setError(err?.response?.data?.message || err.message || "Failed to update profile");
            } finally {
                setLoading(false);
            }
        }
    });

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

                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                    <Divider sx={{mb: 3}}/>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                    <Box sx={{position: "relative", display: "inline-block", mb: 2}}>
                                        <Avatar
                                            src={formik.values.avatar_url || user?.avatar_url || user?.image}
                                            sx={{width: 100, height: 100, fontSize: 32, fontWeight: 700, bgcolor: "secondary.main", color: "#fff"}}>
                                            {initials}
                                        </Avatar>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            style={{display: "none"}}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                // Preview immediately
                                                const reader = new FileReader();
                                                reader.onload = () => formik.setFieldValue("avatar_url", reader.result);
                                                reader.readAsDataURL(file);
                                                // TODO: upload to server and get URL back
                                                // For now, sets a data URL preview. Replace with real upload endpoint.
                                            }}
                                        />
                                        <label htmlFor="avatar-upload">
                                            <Box sx={{
                                                position: "absolute", bottom: 0, right: 0,
                                                width: 32, height: 32, borderRadius: 1,
                                                backgroundColor: "secondary.main", color: "#fff",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                border: "3px solid", borderColor: "background.paper", cursor: "pointer",
                                                transition: "all 0.2s",
                                                "&:hover": {transform: "scale(1.1)"},
                                            }}>
                                                <CameraAltOutlined sx={{fontSize: 14}}/>
                                            </Box>
                                        </label>
                                    </Box>
                                    <Typography variant="subtitle2" sx={{fontWeight: 600}}>{name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {user?.username ? `@${user.username}` : user?.email || ""}
                                    </Typography>

                                    <Divider sx={{my: 2}}/>

                                    <Typography variant="caption" color="text.secondary" sx={{display: "block", mb: 1.5, textAlign: "left"}}>
                                        Update your personal information. Changes will be reflected across the dashboard.
                                    </Typography>

                                    <Stack spacing={1.5}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading || !formik.dirty} startIcon={<SaveOutlined/>}>
                                            Save Changes
                                        </Button>
                                        <Button variant="outlined" color="inherit" fullWidth onClick={() => navigate("/profile")}>
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 2, color: "text.secondary", textTransform: "uppercase", fontSize: 11, letterSpacing: 1}}>
                                        Personal Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 6}}>{field("first_name", "First Name")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("last_name", "Last Name")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("phone", "Phone Number")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("avatar_url", "Avatar URL")}</Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 2, color: "text.secondary", textTransform: "uppercase", fontSize: 11, letterSpacing: 1}}>
                                        Account Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 6}}>{field("email", "Email Address", {type: "email"})}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("username", "Username")}</Grid>
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
