import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Checkbox, Container, Divider,
    FormControl, FormControlLabel, Grid, InputLabel, LinearProgress,
    MenuItem, Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {updateCoupon, selectCoupons} from "../../redux/features/coupons/coupons-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const UpdateCouponPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {couponID} = useParams();
    const {coupons, couponLoading, couponError} = useSelector(selectCoupons);
    const coupon = coupons?.find(c => (c._id || c.id || c.code) === couponID) || null;

    useEffect(() => {
        if (coupon) {
            formik.setValues({
                code: coupon.code || "",
                description: coupon.description || "",
                discount_type: coupon.discount_type || "percent",
                amount: coupon.amount != null ? String(coupon.amount) : "",
                free_shipping: coupon.free_shipping ?? false,
                individual_use: coupon.individual_use ?? false,
                exclude_sale_items: coupon.exclude_sale_items ?? false,
                minimum_amount: coupon.minimum_amount != null ? String(coupon.minimum_amount) : "",
                maximum_amount: coupon.maximum_amount != null ? String(coupon.maximum_amount) : "",
                usage_limit: coupon.usage_limit != null ? String(coupon.usage_limit) : "",
                usage_limit_per_user: coupon.usage_limit_per_user != null ? String(coupon.usage_limit_per_user) : "",
                limit_usage_to_x_items: coupon.limit_usage_to_x_items != null ? String(coupon.limit_usage_to_x_items) : "",
                email_restrictions: (coupon.email_restrictions || []).join(", "),
                status: coupon.status || "ACTIVE",
            });
        }
    }, [coupon]);

    const formik = useFormik({
        initialValues: {
            code: "", description: "", discount_type: "percent", amount: "",
            free_shipping: false, individual_use: false, exclude_sale_items: false,
            minimum_amount: "", maximum_amount: "",
            usage_limit: "", usage_limit_per_user: "", limit_usage_to_x_items: "",
            email_restrictions: "",
            status: "ACTIVE",
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Coupon code is required"),
            amount: Yup.number().min(0, "Amount must be positive").required("Amount is required"),
        }),
        onSubmit: async (values) => {
            const payload = {
                ...values,
                amount: Number(values.amount),
                minimum_amount: values.minimum_amount === "" ? null : Number(values.minimum_amount),
                maximum_amount: values.maximum_amount === "" ? null : Number(values.maximum_amount),
                usage_limit: values.usage_limit === "" ? null : Number(values.usage_limit),
                usage_limit_per_user: values.usage_limit_per_user === "" ? null : Number(values.usage_limit_per_user),
                limit_usage_to_x_items: values.limit_usage_to_x_items === "" ? null : Number(values.limit_usage_to_x_items),
                email_restrictions: values.email_restrictions ? values.email_restrictions.split(",").map(s => s.trim()).filter(Boolean) : [],
            };
            const result = await dispatch(updateCoupon({id: couponID, data: payload}));
            if (!result.error) navigate(`/coupons/${couponID}`);
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
                        <Typography variant="h5">Edit Coupon</Typography>
                    </Stack>
                    {couponError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{couponError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Coupon Data</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, md: 6}}>{field("code", "Coupon code")}</Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <FormControl size="small" fullWidth>
                                                <InputLabel>Discount type</InputLabel>
                                                <Select name="discount_type" value={formik.values.discount_type} onChange={formik.handleChange} label="Discount type">
                                                    <MenuItem value="percent">Percentage</MenuItem>
                                                    <MenuItem value="fixed_cart">Fixed cart discount</MenuItem>
                                                    <MenuItem value="fixed_product">Fixed product discount</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>{field("amount", "Coupon amount", {type: "number"})}</Grid>
                                        <Grid size={{xs: 12}}>{field("description", "Description", {multiline: true, rows: 2})}</Grid>
                                    </Grid>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Usage Restrictions</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, md: 6}}>{field("minimum_amount", "Minimum spend", {type: "number"})}</Grid>
                                        <Grid size={{xs: 12, md: 6}}>{field("maximum_amount", "Maximum spend", {type: "number"})}</Grid>
                                        <Grid size={{xs: 12}}>{field("email_restrictions", "Email restrictions (comma separated)")}</Grid>
                                    </Grid>
                                    <Stack spacing={1} sx={{mt: 2}}>
                                        <FormControlLabel control={<Checkbox name="free_shipping" checked={formik.values.free_shipping} onChange={formik.handleChange}/>} label="Allow free shipping"/>
                                        <FormControlLabel control={<Checkbox name="individual_use" checked={formik.values.individual_use} onChange={formik.handleChange}/>} label="Individual use only"/>
                                        <FormControlLabel control={<Checkbox name="exclude_sale_items" checked={formik.values.exclude_sale_items} onChange={formik.handleChange}/>} label="Exclude sale items"/>
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Usage Limits</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, md: 4}}>{field("usage_limit", "Usage limit per coupon", {type: "number"})}</Grid>
                                        <Grid size={{xs: 12, md: 4}}>{field("usage_limit_per_user", "Usage limit per user", {type: "number"})}</Grid>
                                        <Grid size={{xs: 12, md: 4}}>{field("limit_usage_to_x_items", "Limit usage to X items", {type: "number"})}</Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                            <MenuItem value="ACTIVE">Active</MenuItem>
                                            <MenuItem value="DRAFT">Draft</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={couponLoading}>Save Changes</Button>
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

export default UpdateCouponPage;
