import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchCustomer, updateCustomer, selectCustomer} from "../../redux/features/customers/customers-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const UpdateCustomerPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {customerID} = useParams();
    const {customer, customerLoading, customerError} = useSelector(selectCustomer);

    useEffect(() => {
        if (customerID) dispatch(fetchCustomer(customerID));
    }, [dispatch, customerID]);

    useEffect(() => {
        if (customer) {
            const s = customer.shipping || {};
            const b = customer.billing || {};
            formik.setValues({
                first_name: customer.first_name || "",
                last_name: customer.last_name || "",
                email: customer.email || "",
                username: customer.username || "",
                phone: customer.phone || "",
                status: customer.status || "active",
                gender: customer.gender || "",
                // Shipping
                shipping_address_1: s.address_1 || "",
                shipping_address_2: s.address_2 || "",
                shipping_city: s.city || "",
                shipping_state: s.state || "",
                shipping_state_code: s.state_code || "",
                shipping_postcode: s.postcode || "",
                shipping_country: s.country || "",
                shipping_country_code: s.country_code || "",
                shipping_phone: s.phone || "",
                shipping_email: s.email || "",
                // Billing
                billing_address_1: b.address_1 || "",
                billing_address_2: b.address_2 || "",
                billing_city: b.city || "",
                billing_state: b.state || "",
                billing_state_code: b.state_code || "",
                billing_postcode: b.postcode || "",
                billing_country: b.country || "",
                billing_country_code: b.country_code || "",
                billing_phone: b.phone || "",
                billing_email: b.email || "",
            });
        }
    }, [customer]);

    const formik = useFormik({
        initialValues: {
            first_name: "", last_name: "", email: "", username: "", phone: "", status: "active", gender: "",
            shipping_address_1: "", shipping_address_2: "", shipping_city: "", shipping_state: "", shipping_state_code: "",
            shipping_postcode: "", shipping_country: "", shipping_country_code: "", shipping_phone: "", shipping_email: "",
            billing_address_1: "", billing_address_2: "", billing_city: "", billing_state: "", billing_state_code: "",
            billing_postcode: "", billing_country: "", billing_country_code: "", billing_phone: "", billing_email: "",
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required("First name is required"),
            last_name: Yup.string().required("Last name is required"),
            email: Yup.string().email("Enter a valid email").required("Email is required"),
        }),
        onSubmit: async (values) => {
            const payload = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                username: values.username,
                phone: values.phone,
                status: values.status,
                gender: values.gender,
                shipping: {
                    address_1: values.shipping_address_1, address_2: values.shipping_address_2,
                    city: values.shipping_city, state: values.shipping_state, state_code: values.shipping_state_code,
                    postcode: values.shipping_postcode, country: values.shipping_country, country_code: values.shipping_country_code,
                    phone: values.shipping_phone, email: values.shipping_email,
                },
                billing: {
                    address_1: values.billing_address_1, address_2: values.billing_address_2,
                    city: values.billing_city, state: values.billing_state, state_code: values.billing_state_code,
                    postcode: values.billing_postcode, country: values.billing_country, country_code: values.billing_country_code,
                    phone: values.billing_phone, email: values.billing_email,
                }
            };
            const result = await dispatch(updateCustomer({id: customerID, data: payload}));
            if (!result.error) navigate(`/customers/${customerID}`);
        }
    });

    const field = (name, label, opts = {}) => (
        <TextField name={name} label={label} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={Boolean(formik.touched[name] && formik.errors[name])} helperText={formik.touched[name] && formik.errors[name]}
            size="small" fullWidth {...opts}/>
    );

    return (
        <Layout>
            {customerLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "stretch", sm: "center"}} justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5" sx={{fontWeight: 700}}>Edit Customer</Typography>
                        </Stack>
                        <Button variant="contained" color="secondary" size="small" onClick={formik.handleSubmit} disabled={customerLoading}>Save Changes</Button>
                    </Stack>
                    {customerError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{customerError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                {/* Personal Info */}
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 2, fontWeight: 700}}>Personal Information</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 6}}>{field("first_name", "First name")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("last_name", "Last name")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("email", "Email address", {type: "email"})}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("username", "Username")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("phone", "Phone number")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <FormControl size="small" fullWidth>
                                                <InputLabel>Gender</InputLabel>
                                                <Select name="gender" value={formik.values.gender} onChange={formik.handleChange} label="Gender">
                                                    <MenuItem value="">Not specified</MenuItem>
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Shipping Address */}
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 2, fontWeight: 700}}>Shipping Address</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12}}>{field("shipping_address_1", "Address line 1")}</Grid>
                                        <Grid size={{xs: 12}}>{field("shipping_address_2", "Address line 2 (optional)")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_city", "City")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_state", "State / Region")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_postcode", "Postcode")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_country", "Country")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_phone", "Phone")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_email", "Email")}</Grid>
                                    </Grid>
                                </Paper>

                                {/* Billing Address */}
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 2, fontWeight: 700}}>Billing Address</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12}}>{field("billing_address_1", "Address line 1")}</Grid>
                                        <Grid size={{xs: 12}}>{field("billing_address_2", "Address line 2 (optional)")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_city", "City")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_state", "State / Region")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_postcode", "Postcode")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_country", "Country")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_phone", "Phone")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_email", "Email")}</Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle2" sx={{mb: 2, fontWeight: 700}}>Account Status</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="suspended">Suspended</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={customerLoading}>Save Changes</Button>
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

export default UpdateCustomerPage;
