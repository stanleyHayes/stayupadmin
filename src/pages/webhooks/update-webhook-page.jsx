import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchWebhook, updateWebhook, selectWebhooks} from "../../redux/features/webhooks/webhooks-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const UpdateWebhookPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {webhookID} = useParams();
    const {webhooks, webhookLoading, webhookError} = useSelector(selectWebhooks);

    const existing = webhooks.find(w => String(w._id) === String(webhookID)) || {};

    useEffect(() => {
        if (webhookID && !existing._id) dispatch(fetchWebhook(webhookID));
    }, [dispatch, webhookID]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: existing.name || "",
            topic: existing.topic || "order.created",
            delivery_url: existing.delivery_url || "",
            status: existing.status || "active",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            delivery_url: Yup.string().url("Must be a valid URL").required("Delivery URL is required"),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(updateWebhook({id: webhookID, data: values}));
            if (!result.error) navigate(`/webhooks/${webhookID}`);
        }
    });

    return (
        <Layout>
            {webhookLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Edit Webhook</Typography>
                    </Stack>
                    {webhookError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{webhookError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Webhook Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                name="name" label="Name" required
                                                value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                error={Boolean(formik.touched.name && formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                                size="small" fullWidth
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                name="delivery_url" label="Delivery URL" required
                                                value={formik.values.delivery_url} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                error={Boolean(formik.touched.delivery_url && formik.errors.delivery_url)}
                                                helperText={formik.touched.delivery_url && formik.errors.delivery_url}
                                                size="small" fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Topic</Typography>
                                    <FormControl size="small" fullWidth sx={{mb: 2}}>
                                        <InputLabel>Topic</InputLabel>
                                        <Select name="topic" value={formik.values.topic} onChange={formik.handleChange} label="Topic">
                                            <MenuItem value="order.created">order.created</MenuItem>
                                            <MenuItem value="order.updated">order.updated</MenuItem>
                                            <MenuItem value="order.deleted">order.deleted</MenuItem>
                                            <MenuItem value="product.created">product.created</MenuItem>
                                            <MenuItem value="product.updated">product.updated</MenuItem>
                                            <MenuItem value="customer.created">customer.created</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="paused">Paused</MenuItem>
                                            <MenuItem value="disabled">Disabled</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={webhookLoading}>Save Changes</Button>
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

export default UpdateWebhookPage;
