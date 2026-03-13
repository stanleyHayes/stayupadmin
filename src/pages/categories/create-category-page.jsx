import React from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider,
    FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createCategory, selectCategories} from "../../redux/features/categories/categories-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const CreateCategoryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {categoryLoading, categoryError} = useSelector(selectCategories);

    const formik = useFormik({
        initialValues: {name: "", slug: "", description: "", status: "ACTIVE", published: true},
        validationSchema: Yup.object({
            name: Yup.string().required("Category name is required"),
            slug: Yup.string().required("Slug is required"),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(createCategory(values));
            if (!result.error) navigate("/categories");
        }
    });

    const field = (name, label, opts = {}) => (
        <TextField name={name} label={label} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched[name] && formik.errors[name])} helperText={formik.touched[name] && formik.errors[name]} size="small" fullWidth {...opts}/>
    );

    return (
        <Layout>
            {categoryLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Add Category</Typography>
                    </Stack>
                    {categoryError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{categoryError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Category Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item size={{xs: 12}}>{field("name", "Category name")}</Grid>
                                        <Grid item size={{xs: 12}}>{field("slug", "Slug")}</Grid>
                                        <Grid item size={{xs: 12}}>{field("description", "Description", {multiline: true, rows: 3})}</Grid>
                                    </Grid>
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
                                                <MenuItem value="PENDING">Pending</MenuItem>
                                                <MenuItem value="SUSPENDED">Suspended</MenuItem>
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
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={categoryLoading}>Create Category</Button>
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

export default CreateCategoryPage;
