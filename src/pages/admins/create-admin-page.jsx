import React from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createAdmin, selectAdmins} from "../../redux/features/admins/admins-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const CreateAdminPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {adminLoading, adminError} = useSelector(selectAdmins);

    const formik = useFormik({
        initialValues: {
            firstName: "", lastName: "", email: "", username: "", phone: "",
            role: "admin", status: "ACTIVE", password: "", confirm_password: ""
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            username: Yup.string().required("Username is required"),
            role: Yup.string().required("Role is required"),
            password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
            confirm_password: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Please confirm your password"),
        }),
        onSubmit: async (values) => {
            const {confirm_password, ...payload} = values;
            const result = await dispatch(createAdmin(payload));
            if (!result.error) navigate("/admins");
        }
    });

    const field = (name, label, opts = {}) => (
        <TextField name={name} label={label} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched[name] && formik.errors[name])} helperText={formik.touched[name] && formik.errors[name]} size="small" fullWidth {...opts}/>
    );

    return (
        <Layout>
            {adminLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Add Admin</Typography>
                    </Stack>
                    {adminError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{adminError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Personal Information</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12, md: 6}}>{field("firstName", "First name")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("lastName", "Last name")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("email", "Email address")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("username", "Username")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("phone", "Phone number")}</Grid>
                                    </Grid>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Set Password</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12, md: 6}}>{field("password", "Password", {type: "password"})}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("confirm_password", "Confirm Password", {type: "password"})}</Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Role & Status</Typography>
                                    <Stack spacing={2}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Role</InputLabel>
                                            <Select name="role" value={formik.values.role} onChange={formik.handleChange} label="Role">
                                                <MenuItem value="super_admin">Super Admin</MenuItem>
                                                <MenuItem value="admin">Admin</MenuItem>
                                                <MenuItem value="moderator">Moderator</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                                <MenuItem value="ACTIVE">Active</MenuItem>
                                                <MenuItem value="PENDING">Pending</MenuItem>
                                                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={adminLoading}>Add Admin</Button>
                                        <Button variant="outlined" fullWidth onClick={() => navigate("/admins")}>Cancel</Button>
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

export default CreateAdminPage;
