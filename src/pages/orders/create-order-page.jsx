import React, {useState} from "react";
import {
    Alert, AlertTitle, Autocomplete, Box, Button, Container, Divider,
    FormControl, Grid, IconButton, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createOrder, selectOrder} from "../../redux/features/orders/orders-slice";
import {selectCustomer} from "../../redux/features/customers/customers-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {useFormik} from "formik";
import * as Yup from "yup";

const CreateOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {orderLoading, orderError} = useSelector(selectOrder);
    const {customers} = useSelector(selectCustomer);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orderItems, setOrderItems] = useState([{title: "", price: "", quantity: 1}]);

    const formik = useFormik({
        initialValues: {status: "pending payment", billing_address: "", billing_method: "PayPal", notes: ""},
        validationSchema: Yup.object({
            status: Yup.string().required("Status is required"),
            billing_address: Yup.string().required("Billing address is required"),
        }),
        onSubmit: async (values) => {
            if (!selectedCustomer) { alert("Please select a customer."); return; }
            const payload = {
                status: values.status,
                customer: {_id: selectedCustomer._id, name: selectedCustomer.name, image: ""},
                billing: {address: values.billing_address, method: values.billing_method},
                notes: values.notes,
                orderItems: orderItems.filter(i => i.title).map(i => ({
                    product: {title: i.title, price: {amount: Number(i.price) || 0, currency: "GBP"}},
                    quantity: Number(i.quantity) || 1
                })),
                total: {
                    amount: orderItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0),
                    currency: "GBP"
                }
            };
            const result = await dispatch(createOrder(payload));
            if (!result.error) navigate("/orders");
        }
    });

    const addItem = () => setOrderItems(prev => [...prev, {title: "", price: "", quantity: 1}]);
    const removeItem = (i) => setOrderItems(prev => prev.filter((_, idx) => idx !== i));
    const updateItem = (i, field, value) => setOrderItems(prev => prev.map((item, idx) => idx === i ? {...item, [field]: value} : item));
    const total = orderItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Create Order</Typography>
                    </Stack>
                    {orderError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Order Items</Typography>
                                    <Stack spacing={2}>
                                        {orderItems.map((item, i) => (
                                            <Stack key={i} direction="row" spacing={1} alignItems="center">
                                                <TextField label="Product name" value={item.title} onChange={e => updateItem(i, "title", e.target.value)} size="small" sx={{flex: 2}}/>
                                                <TextField label="Price (GBP)" value={item.price} onChange={e => updateItem(i, "price", e.target.value)} size="small" type="number" inputProps={{min: 0, step: "0.01"}} sx={{flex: 1}}/>
                                                <TextField label="Qty" value={item.quantity} onChange={e => updateItem(i, "quantity", e.target.value)} size="small" type="number" inputProps={{min: 1}} sx={{width: 80}}/>
                                                <IconButton size="small" color="error" onClick={() => removeItem(i)} disabled={orderItems.length === 1}><DeleteIcon fontSize="small"/></IconButton>
                                            </Stack>
                                        ))}
                                    </Stack>
                                    <Button startIcon={<AddIcon/>} onClick={addItem} size="small" sx={{mt: 2}} color="secondary" variant="outlined">Add Item</Button>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Billing Details</Typography>
                                    <Stack spacing={2}>
                                        <TextField label="Billing address" name="billing_address" value={formik.values.billing_address} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.billing_address && formik.errors.billing_address)} helperText={formik.touched.billing_address && formik.errors.billing_address} fullWidth size="small" multiline rows={2}/>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Payment Method</InputLabel>
                                            <Select name="billing_method" value={formik.values.billing_method} onChange={formik.handleChange} label="Payment Method">
                                                <MenuItem value="PayPal">PayPal</MenuItem>
                                                <MenuItem value="Stripe">Stripe</MenuItem>
                                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                <MenuItem value="Cash on Delivery">Cash on Delivery</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField label="Order notes (optional)" name="notes" value={formik.values.notes} onChange={formik.handleChange} fullWidth size="small" multiline rows={3}/>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Order Status</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                            <MenuItem value="pending payment">Pending Payment</MenuItem>
                                            <MenuItem value="on hold">On Hold</MenuItem>
                                            <MenuItem value="processing">Processing</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                            <MenuItem value="refunded">Refunded</MenuItem>
                                            <MenuItem value="failed">Failed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Customer</Typography>
                                    <Autocomplete value={selectedCustomer} onChange={(e, v) => setSelectedCustomer(v)} options={customers} getOptionLabel={o => o.name} size="small" renderInput={params => <TextField {...params} label="Select customer" placeholder="Search..."/>}/>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>Total: <strong>£{total.toFixed(2)}</strong></Typography>
                                    <Divider sx={{my: 1}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={orderLoading}>Create Order</Button>
                                        <Button variant="outlined" fullWidth onClick={() => navigate("/orders")}>Cancel</Button>
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

export default CreateOrderPage;
