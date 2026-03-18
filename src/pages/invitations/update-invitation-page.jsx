import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchInvitation, updateInvitation, selectInvitations} from "../../redux/features/invitations/invitations-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const UpdateInvitationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {invitationID} = useParams();
    const {invitation, invitationLoading, invitationError} = useSelector(selectInvitations);

    useEffect(() => {
        if (invitationID) dispatch(fetchInvitation(invitationID));
    }, [dispatch, invitationID]);

    useEffect(() => {
        if (invitation) {
            formik.setValues({
                email: invitation.email || "",
                role: invitation.role || "admin",
                status: invitation.status || "PENDING",
            });
        }
    }, [invitation]);

    const formik = useFormik({
        initialValues: {email: "", role: "admin", status: "PENDING"},
        validationSchema: Yup.object({
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            role: Yup.string().required("Role is required"),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(updateInvitation({id: invitationID, data: values}));
            if (!result.error) navigate(`/invitations/${invitationID}`);
        }
    });

    return (
        <Layout>
            {invitationLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Edit Invitation</Typography>
                    </Stack>
                    {invitationError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{invitationError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Invitation Details</Typography>
                                    <TextField
                                        name="email" label="Email address"
                                        value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        error={Boolean(formik.touched.email && formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        size="small" fullWidth
                                    />
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
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
                                                <MenuItem value="PENDING">Pending</MenuItem>
                                                <MenuItem value="ACCEPTED">Accepted</MenuItem>
                                                <MenuItem value="EXPIRED">Expired</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={invitationLoading}>Save Changes</Button>
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

export default UpdateInvitationPage;
