import React from "react";
import {
    Alert, AlertTitle, Box, Button, Checkbox, Container, Divider,
    FormControl, FormControlLabel, Grid, InputLabel, LinearProgress,
    MenuItem, Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createCoupon, selectCoupons} from "../../redux/features/coupons/coupons-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const CreateCouponPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {couponLoading, couponError} = useSelector(selectCoupons);

    const formik = useFormik({
        initialValues: {
            code: "", description: "", discount_type: "PERCENTAGE", coupon_amount: "",
            allow_free_shipping: false, is_individual_use: false, exclude_sale_items: false,
            status: "ACTIVE", published: true,
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Coupon code is required"),
            coupon_amount: Yup.number().min(0, "Amount must be positive").required("Amount is required"),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(createCoupon({...values, coupon_amount: Number(values.coupon_amount)}));
            if (!result.error) navigate("/coupons");
        }
    });

    const field = (name, label, opts = {}) => (
        <TextField name={name} label={label} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched[name] && formik.errors[name])} helperText={formik.touched[name] && formik.errors[name]} size="small" fullWidth {...opts}/>
    );

    return (
        <Layout>
            {couponLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Create Coupon</Typography>
                    </Stack>
                    {couponError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{couponError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Coupon Data</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12, md: 6}}>{field("code", "Coupon code")}</Grid>
                                        <Grid item size={{xs: 12, md: 6}}>
                                            <FormControl size="small" fullWidth>
                                                <InputLabel>Discount type</InputLabel>
                                                <Select name="discount_type" value={formik.values.discount_type} onChange={formik.handleChange} label="Discount type">
                                                    <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                                                    <MenuItem value="FIXED">Fixed amount</MenuItem>
                                                    <MenuItem value="FREE_SHIPPING">Free shipping</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item size={{xs: 12, md: 6}}>{field("coupon_amount", "Coupon amount", {type: "number"})}</Grid>
                                        <Grid item size={{xs: 12}}>{field("description", "Description", {multiline: true, rows: 2})}</Grid>
                                    </Grid>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Usage Restrictions</Typography>
                                    <Stack spacing={1}>
                                        <FormControlLabel control={<Checkbox name="allow_free_shipping" checked={formik.values.allow_free_shipping} onChange={formik.handleChange}/>} label="Allow free shipping"/>
                                        <FormControlLabel control={<Checkbox name="is_individual_use" checked={formik.values.is_individual_use} onChange={formik.handleChange}/>} label="Individual use only"/>
                                        <FormControlLabel control={<Checkbox name="exclude_sale_items" checked={formik.values.exclude_sale_items} onChange={formik.handleChange}/>} label="Exclude sale items"/>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                    <Stack spacing={2}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                                <MenuItem value="ACTIVE">Active</MenuItem>
                                                <MenuItem value="UPCOMING">Upcoming</MenuItem>
                                                <MenuItem value="EXPIRED">Expired</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Visibility</InputLabel>
                                            <Select name="published" value={formik.values.published} onChange={formik.handleChange} label="Visibility">
                                                <MenuItem value={true}>Published</MenuItem>
                                                <MenuItem value={false}>Draft</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={couponLoading}>Create Coupon</Button>
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

export default CreateCouponPage;
