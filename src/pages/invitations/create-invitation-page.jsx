import React from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createInvitation, selectInvitations} from "../../redux/features/invitations/invitations-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const CreateInvitationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {invitationLoading, invitationError} = useSelector(selectInvitations);

    const formik = useFormik({
        initialValues: {email: "", role: "admin", message: "", invited_by: "Super Admin"},
        validationSchema: Yup.object({
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            role: Yup.string().required("Role is required"),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(createInvitation(values));
            if (!result.error) navigate("/invitations");
        }
    });

    return (
        <Layout>
            {invitationLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Send Invitation</Typography>
                    </Stack>
                    {invitationError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{invitationError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Invitation Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12}}>
                                            <TextField
                                                name="email" label="Email address"
                                                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                error={Boolean(formik.touched.email && formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                                size="small" fullWidth
                                            />
                                        </Grid>
                                        <Grid item size={{xs: 12}}>
                                            <TextField
                                                name="message" label="Personal message (optional)"
                                                value={formik.values.message} onChange={formik.handleChange}
                                                size="small" fullWidth multiline rows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Role</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select name="role" value={formik.values.role} onChange={formik.handleChange} label="Role">
                                            <MenuItem value="super_admin">Super Admin</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="moderator">Moderator</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={invitationLoading}>Send Invitation</Button>
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

export default CreateInvitationPage;
