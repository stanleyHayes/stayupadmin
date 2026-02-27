// src/pages/products/CreateProductPageFormik.jsx
import React, {useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {useDispatch} from "react-redux";
import {addLocalProduct} from "../../redux/features/products/products-slice";
import Layout from "../../components/shared/layout.jsx";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Autocomplete from "@mui/material/Autocomplete";
import {FieldArray, Form, Formik} from "formik";
import * as Yup from "yup";

/**
 * CreateProductPageFormik.jsx
 *
 * - Formik form with nested structure following your product shape
 * - Yup validation for required fields (title, sku, price)
 * - File inputs produce base64 previews; replace uploadImageToServer with real upload if you have presigned urls
 * - Attribute management + variation generation (Cartesian product of attribute values)
 *
 * NOTE: this file keeps categories/tags local. Replace localCategory state with an API/redux flow if needed.
 */

// ----------------- Helpers -----------------
const readFileAsDataURL = (file) =>
    new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target.result);
        reader.onerror = (e) => rej(e);
        reader.readAsDataURL(file);
    });

// Replace with your upload API (presigned/S3). For now it returns a placeholder URL (base64).
async function uploadImageToServer(file) {
    // Example:
    // 1) request presigned URL from backend
    // 2) PUT the file to S3
    // 3) return the public URL
    // For demo we return base64 preview
    return await readFileAsDataURL(file);
}

const initialValues = {
    sku: "",
    title: "",
    short_description: "",
    description: "",
    price: { currency: "GBP", amount: "" },
    sale: { status: false, price: { currency: "GBP", amount: "" }, start_date: null, end_date: null },
    stock_quantity: "",
    allow_back_orders: false,
    low_stock_threshold: 2,
    sold_individually: false,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    featured: false,
    weight: { unit: "g", amount: "" },
    dimensions: { length: { unit: "cm", amount: "" }, width: { unit: "cm", amount: "" }, height: { unit: "cm", amount: "" } },
    categories: [],
    tags: [],
    upsells: [],
    cross_sells: [],
    attributes: [
        // { name: "Size", values: ["S","M"] }
    ],
    variations: [
        // { sku, price, stock_quantity, attributes: [{name, value}], image }
    ],
    images: [], // primary images (file previews)
    gallery: []
};

const ProductSchema = Yup.object().shape({
    title: Yup.string().required("Product title is required"),
    sku: Yup.string().required("SKU is required"),
    price: Yup.object().shape({
        amount: Yup.number().typeError("Must be a number").min(0, "Must be >= 0").required("Price required")
    }),
    sale: Yup.object().shape({
        // sale.price.amount optional if sale.status false
        price: Yup.object().when("status", {
            is: true,
            then: Yup.object().shape({
                amount: Yup.number().typeError("Must be a number").min(0, "Must be >= 0").required("Sale price required")
            })
        })
    }),
    stock_quantity: Yup.number().typeError("Must be a number").min(0).nullable()
});

// ----------------- Category Dialog (inline create) -----------------
const CategoryDialog = ({ open, onClose, onCreate }) => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = () => {
        if (!name.trim()) return;
        onCreate({
            id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            description
        });
        setName("");
        setSlug("");
        setDescription("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Create category</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
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

// ----------------- Variation generator -----------------
/**
 * Given attributes like:
 * [{name:"Size", values:["S","M"]}, {name:"Color", values:["Red","Blue"]}]
 * return cartesian product:
 * [{attributes:[{name:"Size",value:"S"},{name:"Color",value:"Red"}]}, ...]
 */
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

// ----------------- Main Page -----------------
const CreateProductPageFormik = () => {
    const dispatch = useDispatch();

    // Local categories store (in real app: use redux slice)
    const [categoriesList, setCategoriesList] = useState([
        { id: "clothing", name: "Clothing" },
        { id: "shoes", name: "Shoes" },
        { id: "electronics", name: "Electronics" }
    ]);
    const [catDialogOpen, setCatDialogOpen] = useState(false);

    const sampleUpsellOptions = ["CAP", "HDEE", "NJA"];

    const handleCreateCategory = (cat) => {
        setCategoriesList((s) => [cat, ...s]);
    };

    return (
        <Layout>
            <Container sx={{ py: 4 }}>
                <Paper elevation={0} sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        Add new product (WooCommerce-like)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Form uses Formik + Yup. You can upload images, create categories, add attributes and generate variations.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Formik
                        initialValues={initialValues}
                        validationSchema={ProductSchema}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            setSubmitting(true);
                            try {
                                // Upload images to server (stubbed) and replace previews with urls
                                const uploadList = async (arr) => {
                                    const res = [];
                                    for (const it of arr || []) {
                                        if (it.file) {
                                            const url = await uploadImageToServer(it.file);
                                            res.push({ secure_url: url, alt: it.alt || it.file.name });
                                        } else if (it.preview) {
                                            // already base64 preview
                                            res.push({ secure_url: it.preview, alt: it.alt || "" });
                                        } else if (it.secure_url) {
                                            res.push(it);
                                        }
                                    }
                                    return res;
                                };

                                // Prepare payload
                                const imagesUploaded = await uploadList(values.images || []);
                                const galleryUploaded = await uploadList(values.gallery || []);
                                const variationsPrepared = (values.variations || []).map(async (v) => ({
                                    ...v,
                                    image: v.image?.file ? {secure_url: await uploadImageToServer(v.image.file)} : v.image?.preview ? {secure_url: v.image.preview} : v.image
                                }));

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

                                // optimistic local add:
                                dispatch(addLocalProduct({ ...payload, created_at: moment().toISOString() }));

                                // If you have a backend, call createProduct(payload) thunk:
                                // await dispatch(createProduct(payload)).unwrap();

                                resetForm();
                                // optionally navigate to list or show success
                            } catch (err) {
                                console.error(err);
                                // show toast
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ values, errors, touched, handleChange, setFieldValue, isSubmitting, handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    {/* Left Column (General, Description, Linked) */}
                                    <Grid item size={{ xs: 12, md: 8 }}>
                                        <Stack spacing={2}>
                                            {/* General */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">General</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField
                                                            size="small"
                                                            label="Product title"
                                                            name="title"
                                                            fullWidth
                                                            value={values.title}
                                                            onChange={handleChange}
                                                            error={Boolean(touched.title && errors.title)}
                                                            helperText={touched.title && errors.title ? errors.title : ""}
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField
                                                            size="small"
                                                            label="SKU"
                                                            name="sku"
                                                            fullWidth
                                                            value={values.sku}
                                                            onChange={handleChange}
                                                            error={Boolean(touched.sku && errors.sku)}
                                                            helperText={touched.sku && errors.sku ? errors.sku : ""}
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField
                                                            size="small"
                                                            label="Regular price"
                                                            name="price.amount"
                                                            type="number"
                                                            fullWidth
                                                            value={values.price.amount}
                                                            onChange={(e) => setFieldValue("price.amount", e.target.value)}
                                                            error={Boolean(touched.price?.amount && errors.price?.amount)}
                                                            helperText={touched.price?.amount && errors.price?.amount ? errors.price.amount : ""}
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField
                                                            size="small"
                                                            label="Sale price"
                                                            name="sale.price.amount"
                                                            type="number"
                                                            fullWidth
                                                            value={values.sale.price.amount}
                                                            onChange={(e) => setFieldValue("sale.price.amount", e.target.value)}
                                                            error={Boolean(touched.sale?.price?.amount && errors.sale?.price?.amount)}
                                                            helperText={touched.sale?.price?.amount && errors.sale?.price?.amount ? errors.sale.price.amount : ""}
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <FormControlLabel
                                                            control={<Switch checked={values.sale.status} onChange={(e) => setFieldValue("sale.status", e.target.checked)} />}
                                                            label={values.sale.status ? "On sale" : "Not on sale"}
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                label="Sale start"
                                                                value={values.sale.start_date}
                                                                onChange={(d) => setFieldValue("sale.start_date", d)}
                                                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                label="Sale end"
                                                                value={values.sale.end_date}
                                                                onChange={(d) => setFieldValue("sale.end_date", d)}
                                                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Descriptions */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Descriptions</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12 }}>
                                                        <TextField
                                                            label="Short description"
                                                            size="small"
                                                            fullWidth
                                                            multiline
                                                            rows={3}
                                                            name="short_description"
                                                            value={values.short_description}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <TextField
                                                            label="Product description"
                                                            size="small"
                                                            fullWidth
                                                            multiline
                                                            rows={8}
                                                            name="description"
                                                            value={values.description}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Linked products */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Linked products</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12 }}>
                                                        <SmallAutocomplete
                                                            label="Upsells (SKU)"
                                                            options={sampleUpsellOptions}
                                                            value={values.upsells}
                                                            onChange={(v) => setFieldValue("upsells", v)}
                                                            placeholder="Add SKUs..."
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <SmallAutocomplete
                                                            label="Cross-sells (SKU)"
                                                            options={sampleUpsellOptions}
                                                            value={values.cross_sells}
                                                            onChange={(v) => setFieldValue("cross_sells", v)}
                                                            placeholder="Add SKUs..."
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Stack>
                                    </Grid>

                                    {/* Right Column (Inventory, Shipping, Attributes, Images, Categories & Publish) */}
                                    <Grid item size={{ xs: 12, md: 4 }}>
                                        <Stack spacing={2}>
                                            {/* Inventory */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Inventory</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField
                                                            size="small"
                                                            label="Stock quantity"
                                                            type="number"
                                                            fullWidth
                                                            name="stock_quantity"
                                                            value={values.stock_quantity}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <FormControl fullWidth size="small">
                                                            <InputLabel>Backorders</InputLabel>
                                                            <Select
                                                                label="Backorders"
                                                                value={values.allow_back_orders ? "yes" : "no"}
                                                                onChange={(e) => setFieldValue("allow_back_orders", e.target.value === "yes")}
                                                            >
                                                                <MenuItem value="no">Do not allow</MenuItem>
                                                                <MenuItem value="notify">Allow, but notify</MenuItem>
                                                                <MenuItem value="yes">Allow</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={values.sold_individually} onChange={(e) => setFieldValue("sold_individually", e.target.checked)} />}
                                                            label="Sold individually"
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12, md: "auto" }}>
                                                        <TextField
                                                            size="small"
                                                            label="Low stock threshold"
                                                            type="number"
                                                            fullWidth
                                                            name="low_stock_threshold"
                                                            value={values.low_stock_threshold}
                                                            onChange={handleChange}
                                                        />
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
                                                    {({ push, remove, form: { values: formVals } }) => (
                                                        <Box>
                                                            <Grid container spacing={2} alignItems="center">
                                                                <Grid item size={{ xs: 12, md: "auto" }}>
                                                                    <Button
                                                                        size="small"
                                                                        onClick={() => push({ name: "", values: [""] })}
                                                                    >
                                                                        + Add attribute
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item size={{ xs: 12 }}>
                                                                    {Array.isArray(formVals.attributes) && formVals.attributes.length === 0 && (
                                                                        <Typography variant="caption" color="text.secondary">No attributes yet — add one to create variations.</Typography>
                                                                    )}
                                                                </Grid>
                                                            </Grid>

                                                            <Stack spacing={2} sx={{ mt: 1 }}>
                                                                {formVals.attributes && formVals.attributes.map((attr, idx) => (
                                                                    <Paper key={idx} elevation={0} sx={{ p: 1 }}>
                                                                        <Grid container spacing={1} alignItems="center">
                                                                            <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                <TextField size="small" label="Name" value={attr.name} onChange={(e) => {
                                                                                    const next = [...formVals.attributes];
                                                                                    next[idx].name = e.target.value;
                                                                                    setFieldValue("attributes", next);
                                                                                }} />
                                                                            </Grid>
                                                                            <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                <Autocomplete
                                                                                    multiple
                                                                                    freeSolo
                                                                                    options={[]}
                                                                                    value={attr.values}
                                                                                    onChange={(e, v) => {
                                                                                        const next = [...formVals.attributes];
                                                                                        next[idx].values = v;
                                                                                        setFieldValue("attributes", next);
                                                                                    }}
                                                                                    renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />)}
                                                                                    renderInput={(params) => <TextField {...params} size="small" placeholder="Values (press Enter)" />}
                                                                                />
                                                                            </Grid>

                                                                            <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                <Button size="small" color="error" onClick={() => {
                                                                                    const next = [...formVals.attributes];
                                                                                    next.splice(idx, 1);
                                                                                    setFieldValue("attributes", next);
                                                                                }}>Remove</Button>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Paper>
                                                                ))}
                                                            </Stack>

                                                            <Box sx={{ mt: 2 }}>
                                                                <Button size="small" variant="outlined" onClick={() => {
                                                                    // generate variations from attributes (cartesian)
                                                                    const combos = cartesianAttributes(formVals.attributes || []);
                                                                    setFieldValue("variations", combos);
                                                                }}>
                                                                    Generate variations
                                                                </Button>

                                                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                                                                    Click "Generate variations" after adding attribute names & values. This creates SKU/price/stock rows you can edit.
                                                                </Typography>

                                                                {/* variations table */}
                                                                <Box sx={{ mt: 1 }}>
                                                                    {Array.isArray(values.variations) && values.variations.length > 0 && (
                                                                        <Stack spacing={1}>
                                                                            {values.variations.map((v, vi) => (
                                                                                <Paper key={v.id || vi} elevation={0} sx={{ p: 1 }}>
                                                                                    <Grid container spacing={1} alignItems="center">
                                                                                        <Grid item size={{ xs: 12, md: "auto" }}>
                                                                                            <Typography variant="body2">
                                                                                                {v.attributes.map((a) => `${a.name}:${a.value}`).join(" / ")}
                                                                                            </Typography>
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
                                                                    <Avatar variant="rounded" src={img.preview} sx={{ width: 64, height: 64 }} />
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
                                                                    <Avatar variant="rounded" src={img.preview} sx={{ width: 56, height: 56 }} />
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

                                            {/* Categories & Tags & Publish */}
                                            <Paper elevation={0} sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Categories & Tags</Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item size={{ xs: 12 }}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Autocomplete
                                                                multiple
                                                                options={categoriesList}
                                                                getOptionLabel={(opt) => opt.name}
                                                                value={values.categories}
                                                                onChange={(e, v) => setFieldValue("categories", v)}
                                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={option.id} label={option.name} {...getTagProps({ index })} />)}
                                                                renderInput={(params) => <TextField {...params} size="small" placeholder="Select categories" />}
                                                            />
                                                            <Button size="small" onClick={() => setCatDialogOpen(true)}>+ New</Button>
                                                        </Stack>
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <Autocomplete
                                                            multiple
                                                            freeSolo
                                                            options={[]}
                                                            value={values.tags}
                                                            onChange={(e, v) => setFieldValue("tags", v)}
                                                            renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={index} size="small" label={option} {...getTagProps({ index })} />)}
                                                            renderInput={(params) => <TextField {...params} size="small" placeholder="Tags" />}
                                                        />
                                                    </Grid>

                                                    <Grid item size={{ xs: 12 }}>
                                                        <FormControl fullWidth size="small">
                                                            <InputLabel>Visibility</InputLabel>
                                                            <Select value={values.visibility} label="Visibility" onChange={(e) => setFieldValue("visibility", e.target.value)}>
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
                                                                // reset form (simple)
                                                                setFieldValue("sku", "");
                                                                setFieldValue("title", "");
                                                                setFieldValue("price.amount", "");
                                                                setFieldValue("description", "");
                                                            }}>Reset</Button>
                                                            <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>
                                                                {isSubmitting ? "Saving..." : "Publish"}
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

            <CategoryDialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} onCreate={(c) => {
                handleCreateCategory(c);
            }} />
        </Layout>
    );
};

// ----------------- SmallAutocomplete helper -----------------
const SmallAutocomplete = ({ label, options = [], value = [], onChange, placeholder }) => {
    return (
        <Autocomplete
            multiple
            freeSolo
            options={options}
            value={value}
            onChange={(e, v) => onChange(v)}
            renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={index} size="small" label={option} {...getTagProps({ index })} />)}
            renderInput={(params) => <TextField {...params} size="small" label={label} placeholder={placeholder} />}
        />
    );
};

export default CreateProductPageFormik;
