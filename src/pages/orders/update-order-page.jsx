import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrder, updateOrder, selectOrder} from "../../redux/features/orders/orders-slice";
import {fetchCouriers, selectCouriers} from "../../redux/features/couriers/couriers-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const allStatuses = ["pending", "processing", "on-hold", "shipped", "in-transit", "delivered", "completed", "cancelled", "refunded", "failed", "trash"];
const shippingStatuses = ["pending", "shipped", "in_transit", "out_for_delivery", "delivered"];

const UpdateOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {orderID} = useParams();
    const {order, orderLoading, orderError} = useSelector(selectOrder);
    const {couriers} = useSelector(selectCouriers);

    useEffect(() => {
        if (orderID) dispatch(fetchOrder(orderID));
        dispatch(fetchCouriers());
    }, [dispatch, orderID]);

    useEffect(() => {
        if (order) {
            formik.setValues({
                status: order.status || "pending",
                customer_note: order.customer_note || "",
                payment_method: order.payment_method || "",
                payment_method_title: order.payment_method_title || "",
                transaction_id: order.transaction_id || "",
                courier: (typeof order.courier === "object" ? (order.courier?._id || order.courier?.id) : order.courier) || "",
                tracking_number: order.tracking_number || "",
                shipping_status: order.shipping_status || "pending",
                billing_first_name: order.billing?.first_name || "",
                billing_last_name: order.billing?.last_name || "",
                billing_email: order.billing?.email || "",
                billing_phone: order.billing?.phone || "",
                billing_address_1: order.billing?.address_1 || "",
                billing_city: order.billing?.city || "",
                billing_state: order.billing?.state || "",
                billing_country: order.billing?.country || "",
                billing_postcode: order.billing?.postcode || "",
                shipping_first_name: order.shipping?.first_name || "",
                shipping_last_name: order.shipping?.last_name || "",
                shipping_address_1: order.shipping?.address_1 || "",
                shipping_city: order.shipping?.city || "",
                shipping_state: order.shipping?.state || "",
                shipping_country: order.shipping?.country || "",
                shipping_postcode: order.shipping?.postcode || "",
            });
        }
    }, [order]);

    const formik = useFormik({
        initialValues: {
            status: "pending", customer_note: "",
            payment_method: "", payment_method_title: "", transaction_id: "",
            courier: "", tracking_number: "", shipping_status: "pending",
            billing_first_name: "", billing_last_name: "", billing_email: "", billing_phone: "",
            billing_address_1: "", billing_city: "", billing_state: "", billing_country: "", billing_postcode: "",
            shipping_first_name: "", shipping_last_name: "", shipping_address_1: "",
            shipping_city: "", shipping_state: "", shipping_country: "", shipping_postcode: "",
        },
        validationSchema: Yup.object({status: Yup.string().required("Status is required")}),
        onSubmit: async (values) => {
            const payload = {
                status: values.status,
                customer_note: values.customer_note,
                payment_method: values.payment_method,
                payment_method_title: values.payment_method_title,
                transaction_id: values.transaction_id,
                courier: values.courier,
                tracking_number: values.tracking_number,
                shipping_status: values.shipping_status,
                billing: {
                    first_name: values.billing_first_name, last_name: values.billing_last_name,
                    email: values.billing_email, phone: values.billing_phone,
                    address_1: values.billing_address_1, city: values.billing_city,
                    state: values.billing_state, country: values.billing_country, postcode: values.billing_postcode,
                },
                shipping: {
                    first_name: values.shipping_first_name, last_name: values.shipping_last_name,
                    address_1: values.shipping_address_1, city: values.shipping_city,
                    state: values.shipping_state, country: values.shipping_country, postcode: values.shipping_postcode,
                },
            };
            const result = await dispatch(updateOrder({id: orderID, data: payload}));
            if (!result.error) navigate(`/orders/${orderID}`);
        }
    });

    const field = (name, label, opts = {}) => (
        <TextField name={name} label={label} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={Boolean(formik.touched[name] && formik.errors[name])} helperText={formik.touched[name] && formik.errors[name]}
            size="small" fullWidth {...opts}/>
    );

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "stretch", sm: "center"}} justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5" sx={{fontWeight: 700}}>Edit Order #{order?.number || orderID}</Typography>
                        </Stack>
                        <Button variant="contained" color="secondary" size="small" onClick={formik.handleSubmit} disabled={orderLoading}>Save Changes</Button>
                    </Stack>
                    {orderError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Billing Address</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_first_name", "First name")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_last_name", "Last name")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_email", "Email", {type: "email"})}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_phone", "Phone")}</Grid>
                                        <Grid size={{xs: 12}}>{field("billing_address_1", "Address")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_city", "City")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_state", "State / Region")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_postcode", "Postcode")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("billing_country", "Country")}</Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Shipping Address</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_first_name", "First name")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_last_name", "Last name")}</Grid>
                                        <Grid size={{xs: 12}}>{field("shipping_address_1", "Address")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_city", "City")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_state", "State / Region")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_postcode", "Postcode")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("shipping_country", "Country")}</Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Payment</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 6}}>{field("payment_method", "Payment method")}</Grid>
                                        <Grid size={{xs: 12, sm: 6}}>{field("payment_method_title", "Payment title")}</Grid>
                                        <Grid size={{xs: 12}}>{field("transaction_id", "Transaction ID")}</Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Customer Note</Typography>
                                    {field("customer_note", "Note", {multiline: true, rows: 3})}
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Order Status</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                            {allStatuses.map(s => (
                                                <MenuItem key={s} value={s} sx={{textTransform: "capitalize"}}>{s.replace(/[-_]/g, " ")}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Shipping & Tracking</Typography>
                                    <Stack spacing={2}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Shipping Status</InputLabel>
                                            <Select name="shipping_status" value={formik.values.shipping_status} onChange={formik.handleChange} label="Shipping Status">
                                                {shippingStatuses.map(s => (
                                                    <MenuItem key={s} value={s} sx={{textTransform: "capitalize"}}>{s.replace(/[-_]/g, " ")}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Courier</InputLabel>
                                            <Select name="courier" value={formik.values.courier} onChange={formik.handleChange} label="Courier">
                                                <MenuItem value="">None</MenuItem>
                                                {(couriers || []).map(c => (
                                                    <MenuItem key={c._id || c.id} value={c._id || c.id}>
                                                        {c.name}{c.code ? ` (${c.code})` : ""}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {field("tracking_number", "Tracking number")}
                                        <Typography variant="caption" color="text.muted">Tracking URL is auto-generated from the courier's template.</Typography>
                                    </Stack>
                                </Paper>

                                <Paper elevation={0} sx={{p: 3}}>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={orderLoading}>Save Changes</Button>
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

export default UpdateOrderPage;
