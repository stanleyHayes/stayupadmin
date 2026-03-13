import React from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createCustomer, selectCustomer} from "../../redux/features/customers/customers-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const CreateCustomerPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {customerLoading, customerError} = useSelector(selectCustomer);

    const formik = useFormik({
        initialValues: {
            name: "", email: "", username: "", phone: "",
            status: "ACTIVE",
            shipping_country: "", shipping_county: "", shipping_city: "",
            shipping_postal_code: "", shipping_address_line_1: "", shipping_address_line_2: "",
            billing_country: "", billing_county: "", billing_city: "",
            billing_postal_code: "", billing_address_line_1: "", billing_address_line_2: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Full name is required"),
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            username: Yup.string().required("Username is required"),
        }),
        onSubmit: async (values) => {
            const payload = {
                name: values.name,
                email: values.email,
                username: values.username,
                phone: values.phone,
                status: values.status,
                shipping_address: {
                    country: values.shipping_country,
                    county: values.shipping_county,
                    city: values.shipping_city,
                    postal_code: values.shipping_postal_code,
                    address_line_1: values.shipping_address_line_1,
                    address_line_2: values.shipping_address_line_2,
                },
                billing_address: {
                    country: values.billing_country,
                    county: values.billing_county,
                    city: values.billing_city,
                    postal_code: values.billing_postal_code,
                    address_line_1: values.billing_address_line_1,
                    address_line_2: values.billing_address_line_2,
                }
            };
            const result = await dispatch(createCustomer(payload));
            if (!result.error) navigate("/customers");
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
            {customerLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Add Customer</Typography>
                    </Stack>
                    {customerError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{customerError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Personal Information</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12, md: 6}}>{field("name", "Full name")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("email", "Email address")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("username", "Username")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("phone", "Phone number")}</Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Shipping Address</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12}}>{field("shipping_address_line_1", "Address Line 1")}</Grid>
                                        <Grid item size={{xs: 12}}>{field("shipping_address_line_2", "Address Line 2 (optional)")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("shipping_city", "City")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("shipping_county", "County / State")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("shipping_postal_code", "Postal Code")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("shipping_country", "Country")}</Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Billing Address</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12}}>{field("billing_address_line_1", "Address Line 1")}</Grid>
                                        <Grid item size={{xs: 12}}>{field("billing_address_line_2", "Address Line 2 (optional)")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("billing_city", "City")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("billing_county", "County / State")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("billing_postal_code", "Postal Code")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("billing_country", "Country")}</Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid item size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Account Status</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                            <MenuItem value="ACTIVE">Active</MenuItem>
                                            <MenuItem value="PENDING">Pending</MenuItem>
                                            <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={customerLoading}>Add Customer</Button>
                                        <Button variant="outlined" fullWidth onClick={() => navigate("/customers")}>Cancel</Button>
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

export default CreateCustomerPage;
