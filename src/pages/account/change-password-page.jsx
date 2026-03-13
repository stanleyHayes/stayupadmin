import React, {useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    Grid, LinearProgress, Paper, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import {useFormik} from "formik";
import * as Yup from "yup";

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {current_password: "", new_password: "", confirm_password: ""},
        validationSchema: Yup.object({
            current_password: Yup.string().required("Current password is required"),
            new_password: Yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("new_password")], "Passwords do not match")
                .required("Please confirm your new password"),
        }),
        onSubmit: async (values, {resetForm}) => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 600));
            setLoading(false);
            setSuccess(true);
            resetForm();
        }
    });

    const field = (name, label) => (
        <TextField
            name={name} label={label} type="password"
            value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={Boolean(formik.touched[name] && formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            size="small" fullWidth
        />
    );

    return (
        <Layout>
            {loading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Change Password</Typography>
                    </Stack>
                    {success && <Alert severity="success" sx={{mb: 2}}><AlertTitle>Password changed successfully</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item size={{xs: 12, md: 6}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 3}}>
                                        <LockIcon color="secondary"/>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600}}>Update Your Password</Typography>
                                    </Stack>
                                    <Stack spacing={2}>
                                        {field("current_password", "Current password")}
                                        {field("new_password", "New password")}
                                        {field("confirm_password", "Confirm new password")}
                                    </Stack>
                                    <Divider sx={{my: 3}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>Change Password</Button>
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

export default ChangePasswordPage;
