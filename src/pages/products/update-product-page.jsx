import React, {useEffect, useState} from "react";
import {
    Alert, Avatar, Box, Button, CardMedia, Chip, Container, Divider,
    FormControl, FormControlLabel, Checkbox, Dialog, DialogActions,
    DialogContent, DialogTitle, Grid, IconButton, InputLabel, MenuItem,
    Paper, Select, Snackbar, Stack, Switch, TextField, Typography
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {fetchProduct, updateProduct, selectProducts} from "../../redux/features/products/products-slice";
import Layout from "../../components/shared/layout.jsx";
import Autocomplete from "@mui/material/Autocomplete";
import {FieldArray, Form, Formik} from "formik";
import * as Yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import {motion} from "framer-motion";
import {
    ArrowBack, SaveOutlined, CloudUploadOutlined, CloseRounded,
    InventoryOutlined, LocalShippingOutlined, SellOutlined,
    CategoryOutlined, ImageOutlined, TuneOutlined, AddOutlined,
    DeleteOutlineOutlined, StarOutlined
} from "@mui/icons-material";

const readFileAsDataURL = (file) =>
    new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = (e) => res(e.target.result);
        r.onerror = (e) => rej(e);
        r.readAsDataURL(file);
    });

async function uploadImageToServer(file) {
    if (!file) return null;
    return await readFileAsDataURL(file);
}

const CategoryDialog = ({open, onClose, onCreate}) => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    useEffect(() => { if (!open) { setName(""); setSlug(""); } }, [open]);
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{sx: {borderRadius: 1}}}>
            <DialogTitle sx={{fontWeight: 600}}>Create Category</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField label="Name" value={name} onChange={e => setName(e.target.value)} size="small" fullWidth/>
                    <TextField label="Slug" value={slug} onChange={e => setSlug(e.target.value)} size="small" fullWidth placeholder="auto-generated if empty"/>
                </Stack>
            </DialogContent>
            <DialogActions sx={{p: 2}}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button variant="contained" color="secondary" onClick={() => { if (!name.trim()) return; onCreate({id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`, name, slug: slug || name.toLowerCase().replace(/\s+/g, "-")}); onClose(); }} disabled={!name.trim()}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

function cartesianAttributes(attributes) {
    if (!attributes || attributes.length === 0) return [];
    const combos = attributes.reduce((acc, attr) => {
        const vals = (attr.values || []).filter(v => v !== "");
        if (acc.length === 0) return vals.map(v => [{name: attr.name, value: v}]);
        const res = [];
        acc.forEach(a => { vals.forEach(v => { res.push([...a, {name: attr.name, value: v}]); }); });
        return res;
    }, []);
    return combos.map((c, i) => ({id: `var_${i}_${c.map(x => x.value).join("_")}`, sku: "", price: "", stock_quantity: "", attributes: c, image: null}));
}

const SectionHeader = ({icon, title, subtitle}) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2}}>
        <Box sx={{width: 36, height: 36, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "light.secondary", color: "secondary.main", flexShrink: 0}}>
            {React.cloneElement(icon, {sx: {fontSize: 18}})}
        </Box>
        <Box>
            <Typography variant="subtitle2" sx={{fontWeight: 600, lineHeight: 1.2}}>{title}</Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
    </Stack>
);

const Section = ({icon, title, subtitle, children, delay = 0}) => (
    <motion.div initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94]}}>
        <Paper elevation={0} sx={{p: 3, mb: 2.5}}>
            <SectionHeader icon={icon} title={title} subtitle={subtitle}/>
            {children}
        </Paper>
    </motion.div>
);

const ProductSchema = Yup.object().shape({
    title: Yup.string().required("Product title is required"),
    sku: Yup.string().required("SKU is required"),
    price: Yup.object().shape({amount: Yup.number().typeError("Must be a number").min(0, "Must be >= 0").required("Price required")})
});

const UpdateProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {productID} = useParams();
    const {product, products, productLoading} = useSelector(selectProducts);
    const [localCategories, setLocalCategories] = useState([{id: "clothing", name: "Clothing"}, {id: "shoes", name: "Shoes"}, {id: "electronics", name: "Electronics"}]);
    const [catDialogOpen, setCatDialogOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => { if (productID) dispatch(fetchProduct(productID)); }, [dispatch, productID]);

    const initialValues = React.useMemo(() => {
        const p = product || (Array.isArray(products) ? products.find(x => String(x._id) === String(productID)) : null) || {};
        return {
            sku: p.sku ?? p.id ?? "", title: p.title ?? "", short_description: p.short_description ?? "", description: p.description ?? "",
            price: {currency: p.price?.currency ?? "GBP", amount: p.price?.amount ?? ""},
            sale: {status: p.sale?.status ?? false, price: {currency: p.sale?.price?.currency ?? "GBP", amount: p.sale?.price?.amount ?? ""}, start_date: p.sale?.start_date ? moment(p.sale.start_date) : null, end_date: p.sale?.end_date ? moment(p.sale.end_date) : null},
            stock_quantity: p.stock_quantity ?? "", allow_back_orders: p.allow_back_orders ?? false, low_stock_threshold: p.low_stock_threshold ?? 2, sold_individually: p.sold_individually ?? false,
            status: p.status ?? "PUBLISHED", visibility: p.visibility ?? "PUBLIC", featured: p.featured ?? false,
            weight: {unit: (typeof p.weight === "object" ? p.weight?.unit : null) ?? "g", amount: (typeof p.weight === "object" ? p.weight?.amount : p.weight) ?? ""},
            dimensions: {
                length: {unit: (typeof p.dimensions?.length === "object" ? p.dimensions.length.unit : null) ?? "cm", amount: (typeof p.dimensions?.length === "object" ? p.dimensions.length.amount : p.dimensions?.length) ?? ""},
                width: {unit: (typeof p.dimensions?.width === "object" ? p.dimensions.width.unit : null) ?? "cm", amount: (typeof p.dimensions?.width === "object" ? p.dimensions.width.amount : p.dimensions?.width) ?? ""},
                height: {unit: (typeof p.dimensions?.height === "object" ? p.dimensions.height.unit : null) ?? "cm", amount: (typeof p.dimensions?.height === "object" ? p.dimensions.height.amount : p.dimensions?.height) ?? ""}
            },
            categories: p.categories ?? [], tags: p.tags ?? [], upsells: p.upsells ?? [], cross_sells: p.cross_sells ?? [],
            attributes: p.attributes ?? [],
            variations: (p.variations || []).map((v, idx) => ({id: v.id ?? `var_${idx}`, sku: v.sku ?? "", price: v.price ?? v.price?.amount ?? "", stock_quantity: v.stock_quantity ?? "", attributes: v.attributes ?? [], image: v.image ? {secure_url: v.image.secure_url ?? v.image} : null})),
            images: (p.images || []).map(img => ({secure_url: img.secure_url ?? img.preview})),
            gallery: (p.gallery || []).map(g => ({secure_url: g.secure_url ?? g.preview})),
            _mainImage: p.image?.secure_url || null,
        };
    }, [product, products, productID]);

    if (!product && productLoading) {
        return <Layout><Container sx={{py: 4}}><Typography>Loading product...</Typography></Container></Layout>;
    }

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={ProductSchema}
                        onSubmit={async (values, {setSubmitting}) => {
                            setSubmitting(true);
                            try {
                                const uploadList = async (arr) => {
                                    const res = [];
                                    for (const it of arr || []) {
                                        if (it?.file) { const url = await uploadImageToServer(it.file); res.push({secure_url: url, alt: it.alt || it.file.name}); }
                                        else if (it?.secure_url) res.push(it);
                                        else if (it?.preview) res.push({secure_url: it.preview, alt: it.alt || ""});
                                    }
                                    return res;
                                };
                                const imagesUploaded = await uploadList(values.images || []);
                                const galleryUploaded = await uploadList(values.gallery || []);
                                const variationsPrepared = [];
                                for (const v of values.variations || []) {
                                    let img = null;
                                    if (v.image?.file) img = {secure_url: await uploadImageToServer(v.image.file)};
                                    else if (v.image?.secure_url) img = v.image;
                                    else if (v.image?.preview) img = {secure_url: v.image.preview};
                                    variationsPrepared.push({...v, price: Number(v.price || 0), stock_quantity: v.stock_quantity === "" ? 0 : Number(v.stock_quantity), image: img});
                                }
                                const payload = {
                                    ...values, price: {...values.price, amount: Number(values.price.amount) || 0},
                                    sale: {...values.sale, price: {...values.sale.price, amount: Number(values.sale.price.amount) || 0}, start_date: values.sale.start_date ? moment(values.sale.start_date).toISOString() : null, end_date: values.sale.end_date ? moment(values.sale.end_date).toISOString() : null},
                                    images: imagesUploaded, gallery: galleryUploaded, variations: variationsPrepared
                                };
                                await dispatch(updateProduct({ id: product._id ?? product.id ?? product.sku, data: payload })).unwrap();
                                setSaved(true);
                                setTimeout(() => navigate("/products"), 1200);
                            } catch (err) { console.error(err); } finally { setSubmitting(false); }
                        }}
                    >
                        {({values, errors, touched, handleChange, setFieldValue, isSubmitting, dirty}) => (
                            <Form>
                                {/* Header */}
                                <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.35}}>
                                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" sx={{mb: 3}}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Button startIcon={<ArrowBack/>} onClick={() => navigate("/products")} variant="outlined" size="small" color="inherit">Back</Button>
                                            <Box>
                                                <Typography variant="h5" sx={{fontWeight: 700}}>Edit Product</Typography>
                                                <Typography variant="caption" color="text.secondary">{values.title || "Untitled"} &middot; {values.sku}</Typography>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={1}>
                                            <Button variant="outlined" color="inherit" size="small" onClick={() => navigate("/products")}>Cancel</Button>
                                            <Button type="submit" variant="contained" color="secondary" size="small" startIcon={<SaveOutlined/>} disabled={isSubmitting || !dirty}>
                                                {isSubmitting ? "Saving..." : dirty ? "Save Changes" : "No Changes"}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </motion.div>

                                <Divider sx={{mb: 3}}/>

                                <Grid container spacing={3}>
                                    {/* Left Column */}
                                    <Grid size={{xs: 12, md: 8}}>
                                        {/* Product Image Preview */}
                                        {values._mainImage && (
                                            <motion.div initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                                                <Paper elevation={0} sx={{mb: 2.5, overflow: "hidden", borderRadius: 1}}>
                                                    <CardMedia component="img" image={values._mainImage} alt={values.title} sx={{height: 260, objectFit: "cover"}}/>
                                                </Paper>
                                            </motion.div>
                                        )}

                                        {/* General */}
                                        <Section icon={<SellOutlined/>} title="General Information" subtitle="Basic product details and pricing" delay={0.05}>
                                            <Grid container spacing={2}>
                                                <Grid size={{xs: 12, sm: 8}}>
                                                    <TextField size="small" label="Product Title" name="title" fullWidth value={values.title} onChange={handleChange} error={Boolean(touched.title && errors.title)} helperText={touched.title && errors.title}/>
                                                </Grid>
                                                <Grid size={{xs: 12, sm: 4}}>
                                                    <TextField size="small" label="SKU" name="sku" fullWidth value={values.sku} onChange={handleChange} error={Boolean(touched.sku && errors.sku)} helperText={touched.sku && errors.sku}/>
                                                </Grid>
                                                <Grid size={{xs: 12, sm: 4}}>
                                                    <TextField size="small" label="Regular Price (£)" name="price.amount" type="number" fullWidth value={values.price.amount} onChange={e => setFieldValue("price.amount", e.target.value)} error={Boolean(touched.price?.amount && errors.price?.amount)} helperText={touched.price?.amount && errors.price?.amount}/>
                                                </Grid>
                                                <Grid size={{xs: 12, sm: 4}}>
                                                    <TextField size="small" label="Sale Price (£)" name="sale.price.amount" type="number" fullWidth value={values.sale.price.amount} onChange={e => setFieldValue("sale.price.amount", e.target.value)}/>
                                                </Grid>
                                                <Grid size={{xs: 12, sm: 4}}>
                                                    <Stack direction="row" spacing={2} alignItems="center" sx={{height: "100%"}}>
                                                        <FormControlLabel control={<Switch checked={values.sale.status} onChange={e => setFieldValue("sale.status", e.target.checked)} color="secondary"/>} label={<Typography variant="body2">{values.sale.status ? "On Sale" : "Not on Sale"}</Typography>}/>
                                                    </Stack>
                                                </Grid>
                                                {values.sale.status && (
                                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                                        <Grid size={{xs: 12, sm: 6}}>
                                                            <DatePicker label="Sale Start" value={values.sale.start_date ? moment(values.sale.start_date) : null} onChange={d => setFieldValue("sale.start_date", d)} slotProps={{textField: {size: "small", fullWidth: true}}}/>
                                                        </Grid>
                                                        <Grid size={{xs: 12, sm: 6}}>
                                                            <DatePicker label="Sale End" value={values.sale.end_date ? moment(values.sale.end_date) : null} onChange={d => setFieldValue("sale.end_date", d)} slotProps={{textField: {size: "small", fullWidth: true}}}/>
                                                        </Grid>
                                                    </LocalizationProvider>
                                                )}
                                            </Grid>
                                        </Section>

                                        {/* Descriptions */}
                                        <Section icon={<CategoryOutlined/>} title="Descriptions" subtitle="Product copy for your storefront" delay={0.1}>
                                            <Stack spacing={2}>
                                                <TextField label="Short Description" size="small" fullWidth multiline rows={2} name="short_description" value={values.short_description} onChange={handleChange} placeholder="Brief summary for listing cards"/>
                                                <TextField label="Full Description" size="small" fullWidth multiline rows={5} name="description" value={values.description} onChange={handleChange} placeholder="Detailed product description"/>
                                            </Stack>
                                        </Section>

                                        {/* Images */}
                                        <Section icon={<ImageOutlined/>} title="Images & Gallery" subtitle="Product visuals" delay={0.15}>
                                            <Stack spacing={2.5}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{mb: 1, display: "block", fontWeight: 600}}>Primary Images</Typography>
                                                    <Stack direction="row" spacing={1.5} sx={{flexWrap: "wrap", gap: 1.5}}>
                                                        {(values.images || []).map((img, i) => (
                                                            <Box key={i} sx={{position: "relative", borderRadius: 1, overflow: "hidden", border: "1px solid", borderColor: "divider"}}>
                                                                <Avatar variant="rounded" src={img.preview || img.secure_url} sx={{width: 80, height: 80, borderRadius: 1}}/>
                                                                <IconButton size="small" onClick={() => { const next = [...(values.images || [])]; next.splice(i, 1); setFieldValue("images", next); }} sx={{position: "absolute", top: 2, right: 2, width: 22, height: 22, bgcolor: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": {bgcolor: "rgba(0,0,0,0.7)"}}}>
                                                                    <CloseRounded sx={{fontSize: 14}}/>
                                                                </IconButton>
                                                            </Box>
                                                        ))}
                                                        <input id="primary-image-file" type="file" accept="image/*" style={{display: "none"}} onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const preview = await readFileAsDataURL(file); setFieldValue("images", [...(values.images || []), {file, preview, alt: file.name}]); }}/>
                                                        <label htmlFor="primary-image-file">
                                                            <Box sx={{width: 80, height: 80, borderRadius: 1, border: "2px dashed", borderColor: "divider", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", "&:hover": {borderColor: "secondary.main", backgroundColor: "light.secondary"}}}>
                                                                <CloudUploadOutlined sx={{fontSize: 20, color: "text.secondary", mb: 0.25}}/>
                                                                <Typography variant="caption" color="text.secondary" sx={{fontSize: 9}}>Upload</Typography>
                                                            </Box>
                                                        </label>
                                                    </Stack>
                                                </Box>
                                                <Divider/>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{mb: 1, display: "block", fontWeight: 600}}>Gallery</Typography>
                                                    <Stack direction="row" spacing={1.5} sx={{flexWrap: "wrap", gap: 1.5}}>
                                                        {(values.gallery || []).map((img, i) => (
                                                            <Box key={i} sx={{position: "relative", borderRadius: 1, overflow: "hidden", border: "1px solid", borderColor: "divider"}}>
                                                                <Avatar variant="rounded" src={img.preview || img.secure_url} sx={{width: 72, height: 72, borderRadius: 1}}/>
                                                                <IconButton size="small" onClick={() => { const next = [...(values.gallery || [])]; next.splice(i, 1); setFieldValue("gallery", next); }} sx={{position: "absolute", top: 2, right: 2, width: 20, height: 20, bgcolor: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": {bgcolor: "rgba(0,0,0,0.7)"}}}>
                                                                    <CloseRounded sx={{fontSize: 12}}/>
                                                                </IconButton>
                                                            </Box>
                                                        ))}
                                                        <input id="gallery-file" type="file" accept="image/*" multiple style={{display: "none"}} onChange={async e => { const files = Array.from(e.target.files || []); const next = [...(values.gallery || [])]; for (const f of files) { const preview = await readFileAsDataURL(f); next.push({file: f, preview, alt: f.name}); } setFieldValue("gallery", next); }}/>
                                                        <label htmlFor="gallery-file">
                                                            <Box sx={{width: 72, height: 72, borderRadius: 1, border: "2px dashed", borderColor: "divider", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", "&:hover": {borderColor: "secondary.main", backgroundColor: "light.secondary"}}}>
                                                                <CloudUploadOutlined sx={{fontSize: 18, color: "text.secondary", mb: 0.25}}/>
                                                                <Typography variant="caption" color="text.secondary" sx={{fontSize: 9}}>Add</Typography>
                                                            </Box>
                                                        </label>
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </Section>

                                        {/* Attributes & Variations */}
                                        <Section icon={<TuneOutlined/>} title="Attributes & Variations" subtitle="Product options like size, color" delay={0.2}>
                                            <FieldArray name="attributes">
                                                {({push}) => (
                                                    <Box>
                                                        <Button size="small" variant="outlined" color="secondary" startIcon={<AddOutlined/>} onClick={() => push({name: "", values: [""]})}>Add Attribute</Button>
                                                        <Stack spacing={1.5} sx={{mt: 2}}>
                                                            {values.attributes && values.attributes.map((attr, idx) => (
                                                                <Paper key={idx} elevation={0} sx={{p: 2, backgroundColor: "background.default", borderRadius: 1}}>
                                                                    <Grid container spacing={1.5} alignItems="center">
                                                                        <Grid size={{xs: 12, sm: 3}}>
                                                                            <TextField size="small" label="Attribute" fullWidth value={attr.name} onChange={e => { const next = [...values.attributes]; next[idx].name = e.target.value; setFieldValue("attributes", next); }}/>
                                                                        </Grid>
                                                                        <Grid size={{xs: 12, sm: 7}}>
                                                                            <Autocomplete multiple freeSolo options={[]} value={attr.values} onChange={(e, v) => { const next = [...values.attributes]; next[idx].values = v; setFieldValue("attributes", next); }} renderTags={(value, getTagProps) => value.map((option, index) => { const {key, ...tagProps} = getTagProps({index}); return <Chip key={key ?? index} size="small" color="secondary" variant="outlined" label={option?.name ?? option} {...tagProps}/>; })} renderInput={params => <TextField {...params} size="small" placeholder="Type value + Enter"/>}/>
                                                                        </Grid>
                                                                        <Grid size={{xs: 12, sm: 2}}>
                                                                            <Button size="small" color="error" fullWidth variant="outlined" startIcon={<DeleteOutlineOutlined sx={{fontSize: 16}}/>} onClick={() => { const next = [...values.attributes]; next.splice(idx, 1); setFieldValue("attributes", next); }}>Remove</Button>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Paper>
                                                            ))}
                                                        </Stack>
                                                        {values.attributes?.length > 0 && (
                                                            <Button size="small" variant="contained" color="secondary" sx={{mt: 2}} onClick={() => {
                                                                const combos = cartesianAttributes(values.attributes || []);
                                                                const existingMap = new Map();
                                                                (values.variations || []).forEach(v => { const key = (v.attributes || []).map(a => `${a.name}:${a.value}`).join("|"); existingMap.set(key, v); });
                                                                const merged = combos.map(c => { const key = c.attributes.map(a => `${a.name}:${a.value}`).join("|"); const existing = existingMap.get(key); return existing ? {...existing, attributes: c.attributes} : c; });
                                                                setFieldValue("variations", merged);
                                                            }}>Generate Variations</Button>
                                                        )}
                                                        {Array.isArray(values.variations) && values.variations.length > 0 && (
                                                            <Stack spacing={1} sx={{mt: 2}}>
                                                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>{values.variations.length} Variation(s)</Typography>
                                                                {values.variations.map((v, vi) => (
                                                                    <Paper key={v.id || vi} elevation={0} sx={{p: 2, backgroundColor: "background.default", borderRadius: 1}}>
                                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1}}>
                                                                            {v.attributes.map((a, ai) => <Chip key={ai} label={`${a.name}: ${a.value}`} size="small" color="secondary" variant="outlined"/>)}
                                                                        </Stack>
                                                                        <Grid container spacing={1.5} alignItems="center">
                                                                            <Grid size={{xs: 6, sm: 3}}><TextField size="small" label="SKU" fullWidth value={v.sku} onChange={e => { const next = [...values.variations]; next[vi].sku = e.target.value; setFieldValue("variations", next); }}/></Grid>
                                                                            <Grid size={{xs: 6, sm: 3}}><TextField size="small" label="Price (£)" type="number" fullWidth value={v.price} onChange={e => { const next = [...values.variations]; next[vi].price = e.target.value; setFieldValue("variations", next); }}/></Grid>
                                                                            <Grid size={{xs: 6, sm: 3}}><TextField size="small" label="Stock" type="number" fullWidth value={v.stock_quantity} onChange={e => { const next = [...values.variations]; next[vi].stock_quantity = e.target.value; setFieldValue("variations", next); }}/></Grid>
                                                                            <Grid size={{xs: 6, sm: 3}}>
                                                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                                                    <input id={`var-img-${vi}`} type="file" accept="image/*" style={{display: "none"}} onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const preview = await readFileAsDataURL(file); const next = [...values.variations]; next[vi].image = {file, preview, alt: file.name}; setFieldValue("variations", next); }}/>
                                                                                    <label htmlFor={`var-img-${vi}`}><Button component="span" size="small" variant="outlined" color="secondary">Image</Button></label>
                                                                                    {(v.image?.preview || v.image?.secure_url) && <Avatar src={v.image.preview || v.image.secure_url} sx={{width: 32, height: 32}}/>}
                                                                                    <IconButton size="small" color="error" onClick={() => { const next = [...values.variations]; next.splice(vi, 1); setFieldValue("variations", next); }}><DeleteOutlineOutlined sx={{fontSize: 16}}/></IconButton>
                                                                                </Stack>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Paper>
                                                                ))}
                                                            </Stack>
                                                        )}
                                                    </Box>
                                                )}
                                            </FieldArray>
                                        </Section>

                                        {/* Linked Products */}
                                        <Section icon={<SellOutlined/>} title="Linked Products" subtitle="Upsells and cross-sells" delay={0.25}>
                                            <Stack spacing={2}>
                                                <Autocomplete multiple freeSolo options={[]} value={values.upsells} onChange={(e, v) => setFieldValue("upsells", v)} renderTags={(value, getTagProps) => value.map((option, index) => { const {key, ...tagProps} = getTagProps({index}); return <Chip key={key ?? index} size="small" color="secondary" variant="outlined" label={option?.name ?? option} {...tagProps}/>; })} renderInput={params => <TextField {...params} size="small" label="Upsell Products" placeholder="Type SKU + Enter"/>}/>
                                                <Autocomplete multiple freeSolo options={[]} value={values.cross_sells} onChange={(e, v) => setFieldValue("cross_sells", v)} renderTags={(value, getTagProps) => value.map((option, index) => { const {key, ...tagProps} = getTagProps({index}); return <Chip key={key ?? index} size="small" color="secondary" variant="outlined" label={option?.name ?? option} {...tagProps}/>; })} renderInput={params => <TextField {...params} size="small" label="Cross-sell Products" placeholder="Type SKU + Enter"/>}/>
                                            </Stack>
                                        </Section>
                                    </Grid>

                                    {/* Right Column */}
                                    <Grid size={{xs: 12, md: 4}}>
                                        {/* Status */}
                                        <Section icon={<StarOutlined/>} title="Publish" subtitle="Visibility and status" delay={0.05}>
                                            <Stack spacing={2}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Visibility</InputLabel>
                                                    <Select value={values.visibility} label="Visibility" onChange={e => setFieldValue("visibility", e.target.value)}>
                                                        <MenuItem value="PUBLIC">Public</MenuItem>
                                                        <MenuItem value="PRIVATE">Private</MenuItem>
                                                        <MenuItem value="DRAFT">Draft</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControlLabel control={<Checkbox checked={values.featured} onChange={e => setFieldValue("featured", e.target.checked)} color="secondary"/>} label={<Typography variant="body2">Featured Product</Typography>}/>
                                            </Stack>
                                        </Section>

                                        {/* Categories & Tags */}
                                        <Section icon={<CategoryOutlined/>} title="Categories & Tags" delay={0.1}>
                                            <Stack spacing={2}>
                                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                                    <Autocomplete multiple options={localCategories} getOptionLabel={opt => opt.name} value={values.categories} onChange={(e, v) => setFieldValue("categories", v)} renderTags={(value, getTagProps) => value.map((option, index) => { const {key, ...tagProps} = getTagProps({index}); return <Chip key={key ?? option.id} label={option.name} size="small" color="secondary" {...tagProps}/>; })} renderInput={params => <TextField {...params} size="small" label="Categories"/>} sx={{flex: 1}}/>
                                                    <Button size="small" variant="outlined" color="secondary" onClick={() => setCatDialogOpen(true)} sx={{mt: 0.5, minWidth: 40}}>+</Button>
                                                </Stack>
                                                <Autocomplete multiple freeSolo options={[]} value={values.tags} onChange={(e, v) => setFieldValue("tags", v)} renderTags={(value, getTagProps) => value.map((option, index) => { const {key, ...tagProps} = getTagProps({index}); return <Chip key={key ?? index} size="small" label={option?.name ?? option} {...tagProps}/>; })} renderInput={params => <TextField {...params} size="small" label="Tags" placeholder="Type + Enter"/>}/>
                                            </Stack>
                                        </Section>

                                        {/* Inventory */}
                                        <Section icon={<InventoryOutlined/>} title="Inventory" subtitle="Stock management" delay={0.15}>
                                            <Stack spacing={2}>
                                                <TextField size="small" label="Stock Quantity" name="stock_quantity" type="number" fullWidth value={values.stock_quantity} onChange={handleChange}/>
                                                <TextField size="small" label="Low Stock Threshold" type="number" fullWidth name="low_stock_threshold" value={values.low_stock_threshold} onChange={handleChange}/>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Backorders</InputLabel>
                                                    <Select label="Backorders" value={values.allow_back_orders ? "yes" : "no"} onChange={e => setFieldValue("allow_back_orders", e.target.value === "yes")}>
                                                        <MenuItem value="no">Do not allow</MenuItem>
                                                        <MenuItem value="notify">Allow, but notify</MenuItem>
                                                        <MenuItem value="yes">Allow</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControlLabel control={<Checkbox checked={values.sold_individually} onChange={e => setFieldValue("sold_individually", e.target.checked)} color="secondary"/>} label={<Typography variant="body2">Sold Individually</Typography>}/>
                                            </Stack>
                                        </Section>

                                        {/* Shipping */}
                                        <Section icon={<LocalShippingOutlined/>} title="Shipping" subtitle="Weight and dimensions" delay={0.2}>
                                            <Stack spacing={2}>
                                                <TextField size="small" label="Weight (g)" type="number" fullWidth value={values.weight.amount} onChange={e => setFieldValue("weight.amount", e.target.value)}/>
                                                <Grid container spacing={1.5}>
                                                    <Grid size={{xs: 4}}><TextField size="small" label="L (cm)" type="number" fullWidth value={values.dimensions.length.amount} onChange={e => setFieldValue("dimensions.length.amount", e.target.value)}/></Grid>
                                                    <Grid size={{xs: 4}}><TextField size="small" label="W (cm)" type="number" fullWidth value={values.dimensions.width.amount} onChange={e => setFieldValue("dimensions.width.amount", e.target.value)}/></Grid>
                                                    <Grid size={{xs: 4}}><TextField size="small" label="H (cm)" type="number" fullWidth value={values.dimensions.height.amount} onChange={e => setFieldValue("dimensions.height.amount", e.target.value)}/></Grid>
                                                </Grid>
                                            </Stack>
                                        </Section>

                                        {/* Actions */}
                                        <motion.div initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4, delay: 0.25}}>
                                            <Paper elevation={0} sx={{p: 3, border: "1px solid", borderColor: "divider"}}>
                                                <Stack spacing={1.5}>
                                                    <Button type="submit" variant="contained" color="secondary" fullWidth startIcon={<SaveOutlined/>} disabled={isSubmitting || !dirty}>
                                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                    <Button variant="outlined" color="inherit" fullWidth onClick={() => navigate("/products")}>Cancel</Button>
                                                </Stack>
                                            </Paper>
                                        </motion.div>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </Box>

            <CategoryDialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} onCreate={cat => setLocalCategories(s => [cat, ...s])}/>

            <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                <Alert severity="success" onClose={() => setSaved(false)} sx={{width: "100%"}}>Product updated successfully</Alert>
            </Snackbar>
        </Layout>
    );
};

export default UpdateProductPage;
