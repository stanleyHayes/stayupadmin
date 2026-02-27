// src/pages/products/UpdateProductPage.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
    Divider,
    FormControlLabel,
    Switch,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Chip,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProduct,
    updateProduct,
    updateLocalProduct,
    selectProducts
} from "../../redux/features/products/products-slice";
import Layout from "../../components/shared/layout.jsx";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Autocomplete from "@mui/material/Autocomplete";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

/* -------------------------
   Small helpers & stubs
   ------------------------- */

// read file → base64 preview
const readFileAsDataURL = (file) =>
    new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = (e) => res(e.target.result);
        r.onerror = (e) => rej(e);
        r.readAsDataURL(file);
    });

// Replace with real upload implementation (presigned S3, etc.)
async function uploadImageToServer(file) {
    // For demo we return base64 preview
    if (!file) return null;
    return await readFileAsDataURL(file);
}

// Create category dialog (inline create)
const CategoryDialog = ({ open, onClose, onCreate }) => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!open) {
            setName("");
            setSlug("");
            setDescription("");
        }
    }, [open]);

    const handleCreate = () => {
        if (!name.trim()) return;
        const cat = { id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`, name, slug: slug || name.toLowerCase().replace(/\s+/g, "-"), description };
        onCreate(cat);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Create category</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} size="small" fullWidth />
                    <TextField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} size="small" fullWidth />
                    <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} size="small" fullWidth multiline rows={3} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleCreate} disabled={!name.trim()}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// generate cartesian product combos for attributes
function cartesianAttributes(attributes) {
    if (!attributes || attributes.length === 0) return [];
    const combos = attributes.reduce((acc, attr) => {
        const vals = (attr.values || []).filter((v) => v !== "");
        if (acc.length === 0) {
            return vals.map((v) => [{ name: attr.name, value: v }]);
        } else {
            const res = [];
            acc.forEach((a) => {
                vals.forEach((v) => {
                    res.push([...a, { name: attr.name, value: v }]);
                });
            });
            return res;
        }
    }, []);
    return combos.map((c, i) => ({
        id: `var_${i}_${c.map((x) => x.value).join("_")}`,
        sku: "",
        price: "",
        stock_quantity: "",
        attributes: c,
        image: null
    }));
}

/* -------------------------
   Validation schema
   ------------------------- */
const ProductSchema = Yup.object().shape({
    title: Yup.string().required("Product title is required"),
    sku: Yup.string().required("SKU is required"),
    price: Yup.object().shape({
        amount: Yup.number().typeError("Must be a number").min(0, "Must be >= 0").required("Price required")
    })
});

/* -------------------------
   Main component
   ------------------------- */
const UpdateProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // product id or sku
    const { product, productLoading } = useSelector(selectProducts);
    const [localCategories, setLocalCategories] = useState([
        { id: "clothing", name: "Clothing" },
        { id: "shoes", name: "Shoes" },
        { id: "electronics", name: "Electronics" }
    ]);
    const [catDialogOpen, setCatDialogOpen] = useState(false);

    // fetch product when id changes
    useEffect(() => {
        if (id) dispatch(fetchProduct(id));
    }, [dispatch, id]);

    // when product changes, map into Formik initial structure
    const initialValues = React.useMemo(() => {
        const p = product || {};
        return {
            sku: p.sku ?? p.id ?? "",
            title: p.title ?? "",
            short_description: p.short_description ?? "",
            description: p.description ?? "",
            price: { currency: p.price?.currency ?? "GBP", amount: p.price?.amount ?? "" },
            sale: {
                status: p.sale?.status ?? false,
                price: { currency: p.sale?.price?.currency ?? "GBP", amount: p.sale?.price?.amount ?? "" },
                start_date: p.sale?.start_date ? moment(p.sale.start_date) : null,
                end_date: p.sale?.end_date ? moment(p.sale.end_date) : null
            },
            stock_quantity: p.stock_quantity ?? "",
            allow_back_orders: p.allow_back_orders ?? false,
            low_stock_threshold: p.low_stock_threshold ?? 2,
            sold_individually: p.sold_individually ?? false,
            status: p.status ?? "PUBLISHED",
            visibility: p.visibility ?? "PUBLIC",
            featured: p.featured ?? false,
            weight: { unit: p.weight?.unit ?? "g", amount: p.weight?.amount ?? "" },
            dimensions: {
                length: { unit: p.dimensions?.length?.unit ?? "cm", amount: p.dimensions?.length?.amount ?? "" },
                width: { unit: p.dimensions?.width?.unit ?? "cm", amount: p.dimensions?.width?.amount ?? "" },
                height: { unit: p.dimensions?.height?.unit ?? "cm", amount: p.dimensions?.height?.amount ?? "" }
            },
            categories: p.categories ?? [],
            tags: p.tags ?? [],
            upsells: p.upsells ?? [],
            cross_sells: p.cross_sells ?? [],
            attributes: p.attributes ?? [],
            variations: (p.variations || []).map((v, idx) => ({
                id: v.id ?? `var_${idx}`,
                sku: v.sku ?? "",
                price: v.price ?? v.price?.amount ?? "",
                stock_quantity: v.stock_quantity ?? "",
                attributes: v.attributes ?? [],
                image: v.image ? { secure_url: v.image.secure_url ?? v.image } : null
            })),
            images: (p.images || []).map((img) => ({ secure_url: img.secure_url ?? img.preview })),
            gallery: (p.gallery || []).map((g) => ({ secure_url: g.secure_url ?? g.preview }))
        };
    }, [product]);

    // add category handler
    const handleCreateCategory = (cat) => {
        setLocalCategories((s) => [cat, ...s]);
    };

    // if product empty and still loading, show loading placeholder
    if (!product && productLoading) {
        return (
            <Layout>
                <Container sx={{ py: 4 }}>
                    <Typography>Loading product...</Typography>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container sx={{ py: 4 }}>
                <Paper elevation={0} sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        Update product
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Edit product details, attributes, variations and images. Uses Formik + Yup.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={ProductSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            try {
                                // upload images (if file objects are present) and normalize variation images
                                const uploadList = async (arr) => {
                                    const res = [];
                                    for (const it of arr || []) {
                                        if (it?.file) {
                                            const url = await uploadImageToServer(it.file);
                                            res.push({ secure_url: url, alt: it.alt || it.file.name });
                                        } else if (it?.secure_url) {
                                            res.push(it);
                                        } else if (it?.preview) {
                                            res.push({ secure_url: it.preview, alt: it.alt || "" });
                                        }
                                    }
                                    return res;
                                };

                                const imagesUploaded = await uploadList(values.images || []);
                                const galleryUploaded = await uploadList(values.gallery || []);
                                const variationsPrepared = [];
                                for (const v of values.variations || []) {
                                    let img = null;
                                    if (v.image?.file) {
                                        img = { secure_url: await uploadImageToServer(v.image.file) };
                                    } else if (v.image?.secure_url) {
                                        img = v.image;
                                    } else if (v.image?.preview) {
                                        img = { secure_url: v.image.preview };
                                    }
                                    variationsPrepared.push({
                                        ...v,
                                        price: Number(v.price || 0),
                                        stock_quantity: v.stock_quantity === "" ? 0 : Number(v.stock_quantity),
                                        image: img
                                    });
                                }

                                const payload = {
                                    ...values,
                                    price: { ...values.price, amount: Number(values.price.amount) || 0 },
                                    sale: {
                                        ...values.sale,
                                        price: { ...values.sale.price, amount: Number(values.sale.price.amount) || 0 },
                                        start_date: values.sale.start_date ? moment(values.sale.start_date).toISOString() : null,
                                        end_date: values.sale.end_date ? moment(values.sale.end_date).toISOString() : null
                                    },
                                    images: imagesUploaded,
                                    gallery: galleryUploaded,
                                    variations: variationsPrepared
                                };

                                // optimistic local update
                                dispatch(updateLocalProduct(payload));

                                // if you have an API, call updateProduct thunk:
                                // await dispatch(updateProduct({ id: id, data: payload })).unwrap();

                                // navigate back to products
                                navigate("/products");
                            } catch (err) {
                                console.error(err);
                                // show toast or set form error
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    {/* Left Column */}
                                    <Grid item size={{ xs: 12, md: 8 }}>
                                        <Stack spacing={2}>
                                            {/* General */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">General</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Product title" name="title" fullWidth value={values.title} onChange={handleChange} error={Boolean(touched.title && errors.title)} helperText={touched.title && errors.title ? errors.title : ""} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="SKU" name="sku" fullWidth value={values.sku} onChange={handleChange} error={Boolean(touched.sku && errors.sku)} helperText={touched.sku && errors.sku ? errors.sku : ""} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Regular price" name="price.amount" type="number" fullWidth value={values.price.amount} onChange={(e) => setFieldValue("price.amount", e.target.value)} error={Boolean(touched.price?.amount && errors.price?.amount)} helperText={touched.price?.amount && errors.price?.amount ? errors.price.amount : ""} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Sale price" name="sale.price.amount" type="number" fullWidth value={values.sale.price.amount} onChange={(e) => setFieldValue("sale.price.amount", e.target.value)} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <FormControlLabel control={<Switch checked={values.sale.status} onChange={(e) => setFieldValue("sale.status", e.target.checked)} />} label={values.sale.status ? "On sale" : "Not on sale"} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker label="Sale start" value={values.sale.start_date ? moment(values.sale.start_date) : null} onChange={(d) => setFieldValue("sale.start_date", d)} slotProps={{ textField: { size: "small", fullWidth: true } }} />
                                                        </LocalizationProvider>
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker label="Sale end" value={values.sale.end_date ? moment(values.sale.end_date) : null} onChange={(d) => setFieldValue("sale.end_date", d)} slotProps={{ textField: { size: "small", fullWidth: true } }} />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Description */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Descriptions</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12 }}>
                                                        <TextField label="Short description" size="small" fullWidth multiline rows={3} name="short_description" value={values.short_description} onChange={handleChange} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <TextField label="Product description" size="small" fullWidth multiline rows={8} name="description" value={values.description} onChange={handleChange} />
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Linked products */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Linked products</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12 }}>
                                                        <Autocomplete multiple freeSolo options={[]} value={values.upsells} onChange={(e, v) => setFieldValue("upsells", v)} renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={index} size="small" variant="outlined" label={option} {...getTagProps({ index })} />)} renderInput={(params) => <TextField {...params} size="small" placeholder="Add upsell SKUs" />} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <Autocomplete multiple freeSolo options={[]} value={values.cross_sells} onChange={(e, v) => setFieldValue("cross_sells", v)} renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={index} size="small" variant="outlined" label={option} {...getTagProps({ index })} />)} renderInput={(params) => <TextField {...params} size="small" placeholder="Add cross-sell SKUs" />} />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Stack>
                                    </Grid>

                                    {/* Right Column */}
                                    <Grid item size={{ xs: 12, md: 4 }}>
                                        <Stack spacing={2}>
                                            {/* Inventory */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Inventory</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Stock quantity" name="stock_quantity" type="number" fullWidth value={values.stock_quantity} onChange={handleChange} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <FormControl fullWidth size="small">
                                                            <InputLabel>Backorders</InputLabel>
                                                            <Select variant="outlined" label="Backorders" value={values.allow_back_orders ? "yes" : "no"} onChange={(e) => setFieldValue("allow_back_orders", e.target.value === "yes")}>
                                                                <MenuItem value="no">Do not allow</MenuItem>
                                                                <MenuItem value="notify">Allow, but notify</MenuItem>
                                                                <MenuItem value="yes">Allow</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <FormControlLabel control={<Checkbox checked={values.sold_individually} onChange={(e) => setFieldValue("sold_individually", e.target.checked)} />} label="Sold individually" />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Low stock threshold" type="number" fullWidth name="low_stock_threshold" value={values.low_stock_threshold} onChange={handleChange} />
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Shipping */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Shipping</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Weight (g)" type="number" fullWidth value={values.weight.amount} onChange={(e) => setFieldValue("weight.amount", e.target.value)} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Length (cm)" type="number" fullWidth value={values.dimensions.length.amount} onChange={(e) => setFieldValue("dimensions.length.amount", e.target.value)} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Width (cm)" type="number" fullWidth value={values.dimensions.width.amount} onChange={(e) => setFieldValue("dimensions.width.amount", e.target.value)} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField size="small" label="Height (cm)" type="number" fullWidth value={values.dimensions.height.amount} onChange={(e) => setFieldValue("dimensions.height.amount", e.target.value)} />
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Attributes & Variations */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Attributes & Variations</Typography>
                                                <FieldArray name="attributes">
                                                    {({ push }) => (
                                                        <Box>
                                                            <Grid container spacing={2} alignItems="center">
                                                                <Grid item size={{ xs: 12, md: "auto" }}>
                                                                    <Button size="small" onClick={() => push({ name: "", values: [""] })}>+ Add attribute</Button>
                                                                </Grid>
                                                                <Grid item size={{ xs: 12 }}>
                                                                    <Typography variant="caption" color="text.secondary">Add attribute name & values, then generate variations (preserves existing variation info where attribute combos match).</Typography>
                                                                </Grid>
                                                            </Grid>

                                                            {/* attributes list */}
                                                            <Stack spacing={1} sx={{ mt: 1 }}>
                                                                {values.attributes && values.attributes.map((attr, idx) => (
                                                                    <Paper key={idx} elevation={0} sx={{ p: 1 }}>
                                                                        <Grid container spacing={1} alignItems="center">
                                                                            <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                <TextField size="small" label="Name" value={attr.name} onChange={(e) => {
                                                                                    const next = [...values.attributes];
                                                                                    next[idx].name = e.target.value;
                                                                                    setFieldValue("attributes", next);
                                                                                }} />
                                                                            </Grid>

                                                                            <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                <Autocomplete multiple freeSolo options={[]} value={attr.values} onChange={(e, v) => {
                                                                                    const next = [...values.attributes];
                                                                                    next[idx].values = v;
                                                                                    setFieldValue("attributes", next);
                                                                                }} renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={index} size="small" variant="outlined" label={option} {...getTagProps({ index })} />)} renderInput={(params) => <TextField {...params} size="small" placeholder="Values" />} />
                                                                            </Grid>

                                                                            <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                <Button size="small" color="error" onClick={() => {
                                                                                    const next = [...values.attributes];
                                                                                    next.splice(idx, 1);
                                                                                    setFieldValue("attributes", next);
                                                                                }}>Remove</Button>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Paper>
                                                                ))}
                                                            </Stack>

                                                            <Box sx={{ mt: 1 }}>
                                                                <Button size="small" variant="outlined" onClick={() => {
                                                                    // generate new variations; try to merge with existing ones when attributes match
                                                                    const combos = cartesianAttributes(values.attributes || []);
                                                                    // attempt to merge existing by attributes string
                                                                    const existingMap = new Map();
                                                                    (values.variations || []).forEach((v) => {
                                                                        const key = (v.attributes || []).map(a => `${a.name}:${a.value}`).join("|");
                                                                        existingMap.set(key, v);
                                                                    });
                                                                    const merged = combos.map((c) => {
                                                                        const key = c.attributes.map(a => `${a.name}:${a.value}`).join("|");
                                                                        const existing = existingMap.get(key);
                                                                        return existing ? { ...existing, attributes: c.attributes } : c;
                                                                    });
                                                                    setFieldValue("variations", merged);
                                                                }}>Generate variations</Button>
                                                            </Box>

                                                            {/* show variations */}
                                                            <Box sx={{ mt: 1 }}>
                                                                {Array.isArray(values.variations) && values.variations.length > 0 && (
                                                                    <Stack spacing={1}>
                                                                        {values.variations.map((v, vi) => (
                                                                            <Paper key={v.id || vi} elevation={0} sx={{ p: 1 }}>
                                                                                <Grid container spacing={1} alignItems="center">
                                                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                        <Typography variant="body2">{v.attributes.map(a => `${a.name}:${a.value}`).join(" / ")}</Typography>
                                                                                    </Grid>

                                                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                        <TextField size="small" placeholder="SKU" value={v.sku} onChange={(e) => {
                                                                                            const next = [...values.variations];
                                                                                            next[vi].sku = e.target.value;
                                                                                            setFieldValue("variations", next);
                                                                                        }} />
                                                                                    </Grid>

                                                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                        <TextField size="small" placeholder="Price" type="number" value={v.price} onChange={(e) => {
                                                                                            const next = [...values.variations];
                                                                                            next[vi].price = e.target.value;
                                                                                            setFieldValue("variations", next);
                                                                                        }} />
                                                                                    </Grid>

                                                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                        <TextField size="small" placeholder="Stock" type="number" value={v.stock_quantity} onChange={(e) => {
                                                                                            const next = [...values.variations];
                                                                                            next[vi].stock_quantity = e.target.value;
                                                                                            setFieldValue("variations", next);
                                                                                        }} />
                                                                                    </Grid>

                                                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                        <input id={`var-img-${vi}`} type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (!file) return;
                                                                                            const preview = await readFileAsDataURL(file);
                                                                                            const next = [...values.variations];
                                                                                            next[vi].image = { file, preview, alt: file.name };
                                                                                            setFieldValue("variations", next);
                                                                                        }} />
                                                                                        <label htmlFor={`var-img-${vi}`}>
                                                                                            <Button component="span" size="small" startIcon={<UploadFileIcon />}>Image</Button>
                                                                                        </label>
                                                                                        {v.image?.preview && <Avatar src={v.image.preview} sx={{ width: 36, height: 36, ml: 1 }} />}
                                                                                        {v.image?.secure_url && !v.image.preview && <Avatar src={v.image.secure_url} sx={{ width: 36, height: 36, ml: 1 }} />}
                                                                                    </Grid>

                                                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                        <Button size="small" color="error" onClick={() => {
                                                                                            const next = [...values.variations];
                                                                                            next.splice(vi, 1);
                                                                                            setFieldValue("variations", next);
                                                                                        }}>Remove</Button>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Paper>
                                                                        ))}
                                                                    </Stack>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </FieldArray>
                                            </Paper>

                                            {/* Images */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Images</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12 }}>
                                                        <input id="primary-image-file" type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            const preview = await readFileAsDataURL(file);
                                                            const next = [...(values.images || [])];
                                                            next.push({ file, preview, alt: file.name });
                                                            setFieldValue("images", next);
                                                        }} />
                                                        <label htmlFor="primary-image-file">
                                                            <Button startIcon={<UploadFileIcon />} component="span" size="small" variant="outlined">Upload primary image</Button>
                                                        </label>

                                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                            {(values.images || []).map((img, i) => (
                                                                <Box key={i} sx={{ position: "relative" }}>
                                                                    <Avatar variant="rounded" src={img.preview || img.secure_url} sx={{ width: 64, height: 64 }} />
                                                                    <IconButton size="small" onClick={() => {
                                                                        const next = [...(values.images || [])];
                                                                        next.splice(i, 1);
                                                                        setFieldValue("images", next);
                                                                    }} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "background.paper" }}>
                                                                        <CloseIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <input id="gallery-file" type="file" accept="image/*" style={{ display: "none" }} multiple onChange={async (e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            const next = [...(values.gallery || [])];
                                                            for (const f of files) {
                                                                const preview = await readFileAsDataURL(f);
                                                                next.push({ file: f, preview, alt: f.name });
                                                            }
                                                            setFieldValue("gallery", next);
                                                        }} />
                                                        <label htmlFor="gallery-file">
                                                            <Button startIcon={<UploadFileIcon />} component="span" size="small" variant="outlined">Upload gallery</Button>
                                                        </label>

                                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                            {(values.gallery || []).map((img, i) => (
                                                                <Box key={i} sx={{ position: "relative" }}>
                                                                    <Avatar variant="rounded" src={img.preview || img.secure_url} sx={{ width: 56, height: 56 }} />
                                                                    <IconButton size="small" onClick={() => {
                                                                        const next = [...(values.gallery || [])];
                                                                        next.splice(i, 1);
                                                                        setFieldValue("gallery", next);
                                                                    }} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "background.paper" }}>
                                                                        <CloseIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Categories & Publish */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Categories & Tags</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12 }}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Autocomplete multiple options={localCategories} getOptionLabel={(opt) => opt.name} value={values.categories} onChange={(e, v) => setFieldValue("categories", v)} renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={option.id} label={option.name} {...getTagProps({ index })} />)} renderInput={(params) => <TextField {...params} size="small" placeholder="Select categories" />} />
                                                            <Button size="small" onClick={() => setCatDialogOpen(true)}>+ New</Button>
                                                        </Stack>
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <Autocomplete multiple freeSolo options={[]} value={values.tags} onChange={(e, v) => setFieldValue("tags", v)} renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={index} size="small" label={option} {...getTagProps({ index })} />)} renderInput={(params) => <TextField {...params} size="small" placeholder="Tags" />} />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <FormControl fullWidth size="small">
                                                            <InputLabel>Visibility</InputLabel>
                                                            <Select variant="outlined" value={values.visibility} label="Visibility" onChange={(e) => setFieldValue("visibility", e.target.value)}>
                                                                <MenuItem value="PUBLIC">Public</MenuItem>
                                                                <MenuItem value="PRIVATE">Private</MenuItem>
                                                                <MenuItem value="DRAFT">Draft</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <FormControlLabel control={<Checkbox checked={values.featured} onChange={(e) => setFieldValue("featured", e.target.checked)} />} label="Featured" />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <Stack direction="row" spacing={1}>
                                                            <Button variant="outlined" onClick={() => {
                                                                // reset a few fields
                                                                setFieldValue("sku", initialValues.sku || "");
                                                                setFieldValue("title", initialValues.title || "");
                                                                setFieldValue("price.amount", initialValues.price.amount || "");
                                                                setFieldValue("description", initialValues.description || "");
                                                            }}>Reset to original</Button>
                                                            <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>
                                                                {isSubmitting ? "Saving..." : "Update product"}
                                                            </Button>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Container>

            <CategoryDialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} onCreate={handleCreateCategory} />
        </Layout>
    );
};

export default UpdateProductPage;
