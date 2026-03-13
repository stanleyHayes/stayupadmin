import React, {useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    Grid, LinearProgress, Paper, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const UpdateProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: "Super",
            lastName: "Admin",
            email: "admin@stayup.com",
            username: "superadmin",
            phone: "+1 555 000 0000",
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            username: Yup.string().required("Username is required"),
        }),
        onSubmit: async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 600));
            setLoading(false);
            setSuccess(true);
        }
    });

    const field = (name, label, opts = {}) => (
        <TextField name={name} label={label} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched[name] && formik.errors[name])} helperText={formik.touched[name] && formik.errors[name]} size="small" fullWidth {...opts}/>
    );

    return (
        <Layout>
            {loading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Edit Profile</Typography>
                    </Stack>
                    {success && <Alert severity="success" sx={{mb: 2}}><AlertTitle>Profile updated successfully</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Personal Information</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12, md: 6}}>{field("firstName", "First name")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("lastName", "Last name")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("email", "Email address")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("username", "Username")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("phone", "Phone number")}</Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>Save Changes</Button>
                                        <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>Cancel</Button>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>
        </Layout>
    );
};

export default UpdateProfilePage;
