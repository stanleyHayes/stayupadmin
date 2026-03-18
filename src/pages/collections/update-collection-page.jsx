import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Autocomplete, Box, Button, Checkbox, Chip, Container,
    Divider, FormControlLabel, Grid, LinearProgress, Paper, Stack,
    TextField, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchCollection, updateCollection, selectCollections} from "../../redux/features/collections/collections-slice";
import {fetchProducts, selectProducts} from "../../redux/features/products/products-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useFormik} from "formik";
import * as Yup from "yup";

const UpdateCollectionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {collectionID} = useParams();
    const {collection, collectionLoading, collectionError} = useSelector(selectCollections);
    const {products} = useSelector(selectProducts);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (collectionID) dispatch(fetchCollection(collectionID));
        dispatch(fetchProducts());
    }, [dispatch, collectionID]);

    useEffect(() => {
        if (collection) {
            formik.setValues({
                name: collection.name || "",
                description: collection.description || "",
                image_url: (typeof collection.image === "object" ? (collection.image?.secure_url || collection.image?.url || collection.image?.src) : collection.image) || "",
                featured: collection.featured || false,
                is_active: collection.is_active ?? true,
            });
            // Set selected products from populated array
            if (Array.isArray(collection.products)) {
                setSelectedProducts(collection.products.map(p => typeof p === "object" ? p : {_id: p}));
            }
        }
    }, [collection]);

    const formik = useFormik({
        initialValues: {name: "", description: "", image_url: "", featured: false, is_active: true},
        validationSchema: Yup.object({name: Yup.string().required("Name is required")}),
        onSubmit: async (values) => {
            const payload = {
                name: values.name,
                description: values.description,
                image: values.image_url ? {name: values.name, src: values.image_url, alt: values.name} : undefined,
                featured: values.featured,
                is_active: values.is_active,
                products: selectedProducts.map(p => p._id || p.id),
            };
            const result = await dispatch(updateCollection({id: collectionID, data: payload}));
            if (!result.error) navigate(`/collections/${collectionID}`);
        }
    });

    const field = (name, label, opts = {}) => (
        <TextField name={name} label={label} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={Boolean(formik.touched[name] && formik.errors[name])} helperText={formik.touched[name] && formik.errors[name]}
            size="small" fullWidth {...opts}/>
    );

    return (
        <Layout>
            {collectionLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5" sx={{fontWeight: 700}}>Edit Collection</Typography>
                    </Stack>
                    {collectionError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{collectionError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Collection Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12}}>{field("name", "Collection name")}</Grid>
                                        <Grid size={{xs: 12}}>{field("description", "Description", {multiline: true, rows: 3})}</Grid>
                                        <Grid size={{xs: 12}}>{field("image_url", "Cover image URL")}</Grid>
                                    </Grid>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Products</Typography>
                                    <Autocomplete
                                        multiple
                                        options={products || []}
                                        value={selectedProducts}
                                        onChange={(_, val) => setSelectedProducts(val)}
                                        getOptionLabel={(opt) => opt.name || opt.title || ""}
                                        isOptionEqualToValue={(opt, val) => (opt._id || opt.id) === (val._id || val.id)}
                                        renderTags={(value, getTagProps) => value.map((opt, i) => (
                                            <Chip {...getTagProps({index: i})} key={opt._id || i} label={opt.name || opt.title} size="small" color="secondary" variant="outlined"/>
                                        ))}
                                        renderInput={(params) => <TextField {...params} size="small" label="Select products" placeholder="Search products..."/>}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{mt: 1, display: "block"}}>{selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Settings</Typography>
                                    <Stack spacing={1}>
                                        <FormControlLabel control={<Checkbox name="featured" checked={formik.values.featured} onChange={formik.handleChange} color="secondary"/>} label="Featured collection"/>
                                        <FormControlLabel control={<Checkbox name="is_active" checked={formik.values.is_active} onChange={formik.handleChange} color="secondary"/>} label="Active"/>
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={collectionLoading}>Save Changes</Button>
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

export default UpdateCollectionPage;
