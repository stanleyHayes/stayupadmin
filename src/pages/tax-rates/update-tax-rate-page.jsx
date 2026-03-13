import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Checkbox, Container, Divider,
    FormControl, FormControlLabel, Grid, InputLabel, LinearProgress,
    MenuItem, Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTaxRate, updateTaxRate, selectTaxRates} from "../../redux/features/tax-rates/tax-rates-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const UpdateTaxRatePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {taxRateID} = useParams();
    const {taxRates, taxRateLoading, taxRateError} = useSelector(selectTaxRates);

    const existing = taxRates.find(r => String(r._id) === String(taxRateID)) || {};

    useEffect(() => {
        if (taxRateID && !existing._id) dispatch(fetchTaxRate(taxRateID));
    }, [dispatch, taxRateID]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: existing.name || "",
            country: existing.country || "",
            state: existing.state || "",
            postcode: existing.postcode || "",
            city: existing.city || "",
            rate: existing.rate ?? "",
            tax_class: existing.tax_class || "standard",
            priority: existing.priority ?? 1,
            compound: existing.compound ?? false,
            shipping: existing.shipping ?? true,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            rate: Yup.number().required("Rate is required").min(0),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(updateTaxRate({id: taxRateID, data: {...values, rate: Number(values.rate), priority: Number(values.priority)}}));
            if (!result.error) navigate(`/tax-rates/${taxRateID}`);
        }
    });

    return (
        <Layout>
            {taxRateLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Edit Tax Rate</Typography>
                    </Stack>
                    {taxRateError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{taxRateError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Rate Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12}}>
                                            <TextField name="name" label="Name" required value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.name && formik.errors.name)} helperText={formik.touched.name && formik.errors.name} size="small" fullWidth/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <TextField name="country" label="Country (ISO code)" value={formik.values.country} onChange={formik.handleChange} size="small" fullWidth/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <TextField name="state" label="State (code)" value={formik.values.state} onChange={formik.handleChange} size="small" fullWidth/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <TextField name="postcode" label="Postcode" value={formik.values.postcode} onChange={formik.handleChange} size="small" fullWidth/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <TextField name="city" label="City" value={formik.values.city} onChange={formik.handleChange} size="small" fullWidth/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <TextField name="rate" label="Rate (%)" type="number" required value={formik.values.rate} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.rate && formik.errors.rate)} helperText={formik.touched.rate && formik.errors.rate} size="small" fullWidth/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <TextField name="priority" label="Priority" type="number" value={formik.values.priority} onChange={formik.handleChange} size="small" fullWidth/>
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <FormControlLabel control={<Checkbox name="compound" checked={formik.values.compound} onChange={formik.handleChange}/>} label="Compound"/>
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <FormControlLabel control={<Checkbox name="shipping" checked={formik.values.shipping} onChange={formik.handleChange}/>} label="Apply to shipping"/>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Tax Class</Typography>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Class</InputLabel>
                                        <Select name="tax_class" value={formik.values.tax_class} onChange={formik.handleChange} label="Class">
                                            <MenuItem value="standard">Standard</MenuItem>
                                            <MenuItem value="reduced-rate">Reduced Rate</MenuItem>
                                            <MenuItem value="zero-rate">Zero Rate</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Divider sx={{mb: 2}}/>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={taxRateLoading}>Save Changes</Button>
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

export default UpdateTaxRatePage;
