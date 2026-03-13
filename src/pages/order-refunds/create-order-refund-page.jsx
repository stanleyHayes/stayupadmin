import React from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createOrderRefund, selectOrderRefunds} from "../../redux/features/order-refunds/order-refunds-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const CreateOrderRefundPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {orderRefundLoading, orderRefundError} = useSelector(selectOrderRefunds);

    const formik = useFormik({
        initialValues: {order_id: "", amount: "", reason: "", status: "PENDING"},
        validationSchema: Yup.object({
            order_id: Yup.string().required("Order ID is required"),
            amount: Yup.number().required("Amount is required").positive("Must be positive"),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(createOrderRefund({...values, amount: Number(values.amount)}));
            if (!result.error) navigate("/order-refunds");
        }
    });

    return (
        <Layout>
            {orderRefundLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Create Refund</Typography>
                    </Stack>
                    {orderRefundError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderRefundError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Refund Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <TextField
                                                name="order_id" label="Order ID" required
                                                value={formik.values.order_id} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                error={Boolean(formik.touched.order_id && formik.errors.order_id)}
                                                helperText={formik.touched.order_id && formik.errors.order_id}
                                                size="small" fullWidth
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <TextField
                                                name="amount" label="Amount" type="number" required
                                                value={formik.values.amount} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                error={Boolean(formik.touched.amount && formik.errors.amount)}
                                                helperText={formik.touched.amount && formik.errors.amount}
                                                size="small" fullWidth
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                name="reason" label="Reason"
                                                value={formik.values.reason} onChange={formik.handleChange}
                                                size="small" fullWidth multiline rows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                            <MenuItem value="PENDING">Pending</MenuItem>
                                            <MenuItem value="PROCESSED">Processed</MenuItem>
                                            <MenuItem value="FAILED">Failed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={orderRefundLoading}>Create Refund</Button>
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

export default CreateOrderRefundPage;
