import React, {useEffect, useState} from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Tab, Tabs, Typography,
    Alert, AlertTitle, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchProduct, deleteProduct, selectProducts} from "../../redux/features/products/products-slice";
import {productImageUrl} from "../../utils/helpers.js";
import moment from "moment";
import {ArrowBack, Edit, Delete, ImageNotSupported, Star, ContentCopy} from "@mui/icons-material";
import {DetailSkeleton} from "../../components/shared/page-skeleton.jsx";

const stockMap = {instock: {l: "In Stock", c: "success"}, outofstock: {l: "Out of Stock", c: "error"}, onbackorder: {l: "Backorder", c: "warning"}};

const ProductDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {productID} = useParams();
    const {product, productLoading, productError} = useSelector(selectProducts);
    const [activeImg, setActiveImg] = useState(0);
    const [tab, setTab] = useState(0);

    useEffect(() => { if (productID) dispatch(fetchProduct(productID)); }, [dispatch, productID]);
    useEffect(() => { setActiveImg(0); setTab(0); }, [product]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this product?")) return;
        await dispatch(deleteProduct(productID));
        navigate("/products");
    };

    if (productLoading && !product) return <Layout><Box sx={{pt: 4, pb: 6}}><DetailSkeleton/></Box></Layout>;

    const p = product || {};
    const name = p.name || p.title || "Untitled";
    const regular = Number(p.regular_price || p.price || 0);
    const sale = Number(p.sale_price || 0);
    const onSale = p.on_sale || (sale > 0 && sale < regular);
    const discount = onSale && regular > 0 ? Math.round(((regular - sale) / regular) * 100) : 0;
    const images = p.images || [];
    const mainImg = images[activeImg]?.secure_url || images[activeImg]?.url || images[activeImg]?.src || productImageUrl(p);
    const st = stockMap[p.stock_status] || {l: p.stock_status || "—", c: "default"};
    const created = p.date_created || p.created_at;

    const DetailRow = ({label, children}) => (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{py: 1, borderBottom: 1, borderColor: "divider"}}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" component="div" sx={{fontWeight: 500, textAlign: "right"}}>{children ?? "—"}</Typography>
        </Stack>
    );

    return (
        <Layout>
            {productLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 3, pb: 8}}>
                {productError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{productError}</AlertTitle></Alert>}
                <Container maxWidth="lg">
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} justifyContent="space-between" alignItems={{xs: "stretch", sm: "center"}} sx={{mb: 3}} spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} size="small" color="inherit">Back</Button>
                            <Divider orientation="vertical" flexItem/>
                            <Typography variant="body2" color="text.secondary">Products</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/products/${productID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<Edit/>} variant="contained" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<Delete/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={4}>
                        {/* ═══ LEFT: Gallery ═══ */}
                        <Grid size={{xs: 12, md: 5}}>
                            <Box sx={{position: {md: "sticky"}, top: {md: 80}}}>
                                <Paper elevation={0} sx={{overflow: "hidden", position: "relative", aspectRatio: "4/3", backgroundColor: "background.alternative", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    {mainImg ? (
                                        <Box component="img" src={mainImg} alt={name} sx={{width: "100%", height: "100%", objectFit: "cover"}}/>
                                    ) : (
                                        <ImageNotSupported sx={{fontSize: 64, color: "action.disabled"}}/>
                                    )}
                                    {onSale && <Chip label={`${discount}% OFF`} size="small" sx={{position: "absolute", top: 12, left: 12, fontWeight: 700, backgroundColor: "#EF4444", color: "#fff"}}/>}
                                    {p.featured && <Star sx={{position: "absolute", top: 12, right: 12, fontSize: 22, color: "#F59E0B"}}/>}
                                </Paper>
                                {images.length > 1 && (
                                    <Stack direction="row" spacing={1} sx={{mt: 1.5, overflowX: "auto", pb: 0.5}}>
                                        {images.map((img, i) => (
                                            <Paper key={i} elevation={0} onClick={() => setActiveImg(i)} sx={{
                                                width: 64, height: 64, flexShrink: 0, overflow: "hidden", cursor: "pointer",
                                                outline: activeImg === i ? "2px solid" : "none", outlineColor: "secondary.main",
                                                outlineOffset: 2, opacity: activeImg === i ? 1 : 0.5, transition: "all 0.15s",
                                                "&:hover": {opacity: 1}
                                            }}>
                                                <Box component="img" src={img.secure_url || img.url || img.src} sx={{width: "100%", height: "100%", objectFit: "cover"}}/>
                                            </Paper>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Grid>

                        {/* ═══ RIGHT: Info ═══ */}
                        <Grid size={{xs: 12, md: 7}}>
                            {/* Name + meta */}
                            <Box sx={{mb: 3}}>
                                <Typography variant="h5" sx={{fontWeight: 800, mb: 0.5, lineHeight: 1.3}}>{name}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                    {p.sku && <Chip label={p.sku} size="small" variant="outlined" sx={{fontFamily: "monospace", height: 22, fontSize: 11}}/>}
                                    {p.type && <Chip label={p.type} size="small" sx={{height: 22, fontSize: 10, textTransform: "capitalize", backgroundColor: "light.secondary", color: "secondary.main"}}/>}
                                    {p.status && <Chip label={p.status === "publish" ? "Published" : p.status} size="small" color={p.status === "publish" ? "success" : "default"} sx={{height: 22, fontSize: 10, textTransform: "capitalize"}}/>}
                                </Stack>
                            </Box>

                            {/* Price */}
                            <Paper elevation={0} sx={{p: 2.5, mb: 3, backgroundColor: onSale ? "light.red" : "background.alternative"}}>
                                <Stack direction="row" spacing={2} alignItems="baseline">
                                    <Typography sx={{fontSize: 32, fontWeight: 800, lineHeight: 1, color: onSale ? "text.red" : "text.primary"}}>
                                        GH₵{(onSale ? sale : regular).toFixed(2)}
                                    </Typography>
                                    {onSale && (
                                        <Typography sx={{fontSize: 18, color: "text.muted", textDecoration: "line-through"}}>
                                            GH₵{regular.toFixed(2)}
                                        </Typography>
                                    )}
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{mt: 1}}>
                                    <Chip label={st.l} size="small" color={st.c} sx={{fontWeight: 600, height: 24}}/>
                                    {p.manage_stock && p.stock_quantity != null && (
                                        <Typography variant="caption" color="text.secondary">{p.stock_quantity} in stock</Typography>
                                    )}
                                    {onSale && (p.date_on_sale_from || p.date_on_sale_to) && (
                                        <Typography variant="caption" color="text.muted">
                                            Sale: {p.date_on_sale_from ? moment(p.date_on_sale_from).format("MMM D") : "now"} — {p.date_on_sale_to ? moment(p.date_on_sale_to).format("MMM D") : "ongoing"}
                                        </Typography>
                                    )}
                                </Stack>
                            </Paper>

                            {/* Short description */}
                            {p.short_description && (
                                <Typography variant="body2" sx={{mb: 3, lineHeight: 1.8, color: "text.secondary"}}>{p.short_description}</Typography>
                            )}

                            {/* Tabs */}
                            <Box sx={{borderBottom: 1, borderColor: "divider", mb: 0}}>
                                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{minHeight: 40}}>
                                    <Tab label="Details" sx={{minHeight: 40, textTransform: "none", fontSize: 13, fontWeight: 600}}/>
                                    <Tab label="Description" sx={{minHeight: 40, textTransform: "none", fontSize: 13, fontWeight: 600}}/>
                                    {p.variations && p.variations.length > 0 && (
                                        <Tab label={`Variations (${p.variations.length})`} sx={{minHeight: 40, textTransform: "none", fontSize: 13, fontWeight: 600}}/>
                                    )}
                                </Tabs>
                            </Box>

                            {/* Tab: Details */}
                            {tab === 0 && (
                                <Box sx={{pt: 2}}>
                                    <Grid container spacing={3}>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <Typography variant="caption" color="text.muted" sx={{fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontSize: 10, mb: 1, display: "block"}}>Inventory</Typography>
                                            <DetailRow label="Stock Status"><Chip label={st.l} size="small" color={st.c} sx={{height: 22, fontSize: 11}}/></DetailRow>
                                            <DetailRow label="Quantity">{p.stock_quantity ?? "—"}</DetailRow>
                                            <DetailRow label="Manage Stock">{p.manage_stock ? "Yes" : "No"}</DetailRow>
                                            <DetailRow label="Backorders"><span style={{textTransform: "capitalize"}}>{p.backorders || "no"}</span></DetailRow>
                                            <DetailRow label="Sold Individually">{p.sold_individually ? "Yes" : "No"}</DetailRow>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <Typography variant="caption" color="text.muted" sx={{fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontSize: 10, mb: 1, display: "block"}}>Shipping & Tax</Typography>
                                            <DetailRow label="Weight">{p.weight ? `${p.weight}g` : "—"}</DetailRow>
                                            <DetailRow label="Dimensions">{p.dimensions ? [p.dimensions.length, p.dimensions.width, p.dimensions.height].filter(Boolean).join(" x ") || "—" : "—"}</DetailRow>
                                            <DetailRow label="Tax Status"><span style={{textTransform: "capitalize"}}>{p.tax_status || "taxable"}</span></DetailRow>
                                            <DetailRow label="Tax Class">{p.tax_class || "Standard"}</DetailRow>
                                            <DetailRow label="Shipping Class">{p.shipping_class || "—"}</DetailRow>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <Typography variant="caption" color="text.muted" sx={{fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontSize: 10, mb: 1, display: "block"}}>Publishing</Typography>
                                            <DetailRow label="Status"><Chip label={p.status || "—"} size="small" color={p.status === "publish" ? "success" : "default"} sx={{height: 22, fontSize: 11, textTransform: "capitalize"}}/></DetailRow>
                                            <DetailRow label="Visibility"><span style={{textTransform: "capitalize"}}>{p.catalog_visibility || "visible"}</span></DetailRow>
                                            <DetailRow label="Featured">{p.featured ? "Yes" : "No"}</DetailRow>
                                            <DetailRow label="Reviews">{p.reviews_allowed ? "Allowed" : "Disabled"}</DetailRow>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <Typography variant="caption" color="text.muted" sx={{fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontSize: 10, mb: 1, display: "block"}}>Stats & Dates</Typography>
                                            <DetailRow label="Total Sales">{p.total_sales || 0}</DetailRow>
                                            <DetailRow label="Avg Rating">{p.average_rating ? `${Number(p.average_rating).toFixed(1)} / 5` : "—"}</DetailRow>
                                            <DetailRow label="Reviews Count">{p.rating_count ?? 0}</DetailRow>
                                            {created && <DetailRow label="Created">{moment(created).format("MMM D, YYYY")}</DetailRow>}
                                            {p.updated_at && <DetailRow label="Updated">{moment(p.updated_at).format("MMM D, YYYY")}</DetailRow>}
                                        </Grid>
                                    </Grid>

                                    {/* Categories & Tags */}
                                    {((p.categories?.length > 0) || (p.tags?.length > 0)) && (
                                        <Box sx={{mt: 3}}>
                                            <Divider sx={{mb: 2}}/>
                                            <Stack direction={{xs: "column", sm: "row"}} spacing={3}>
                                                {p.categories?.length > 0 && (
                                                    <Box sx={{flex: 1}}>
                                                        <Typography variant="caption" color="text.muted" sx={{fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontSize: 10, mb: 1, display: "block"}}>Categories</Typography>
                                                        <Stack direction="row" flexWrap="wrap" sx={{gap: 0.75}}>
                                                            {p.categories.map((c, i) => <Chip key={i} label={c.name || c} size="small" color="secondary" variant="outlined"/>)}
                                                        </Stack>
                                                    </Box>
                                                )}
                                                {p.tags?.length > 0 && (
                                                    <Box sx={{flex: 1}}>
                                                        <Typography variant="caption" color="text.muted" sx={{fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontSize: 10, mb: 1, display: "block"}}>Tags</Typography>
                                                        <Stack direction="row" flexWrap="wrap" sx={{gap: 0.75}}>
                                                            {p.tags.map((t, i) => <Chip key={i} label={t?.name || t} size="small" variant="outlined"/>)}
                                                        </Stack>
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Tab: Description */}
                            {tab === 1 && (
                                <Box sx={{pt: 3}}>
                                    <Typography variant="body2" sx={{whiteSpace: "pre-wrap", lineHeight: 1.9}}>
                                        {p.description || "No description available."}
                                    </Typography>
                                </Box>
                            )}

                            {/* Tab: Variations */}
                            {tab === 2 && p.variations && (
                                <Box sx={{pt: 2}}>
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Attributes</TableCell>
                                                    <TableCell>SKU</TableCell>
                                                    <TableCell align="right">Price</TableCell>
                                                    <TableCell align="center">Stock</TableCell>
                                                    <TableCell>Image</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {p.variations.map((v, i) => (
                                                    <TableRow key={v.id ?? i} hover>
                                                        <TableCell>
                                                            <Stack direction="row" flexWrap="wrap" sx={{gap: 0.5}}>
                                                                {(v.attributes || v.default_attributes || []).map((a, ai) => (
                                                                    <Chip key={ai} label={`${a.name}: ${a.option || a.value}`} size="small" variant="outlined" sx={{height: 22, fontSize: 11}}/>
                                                                ))}
                                                                {(!v.attributes || v.attributes.length === 0) && "—"}
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell><Typography variant="caption" sx={{fontFamily: "monospace"}}>{v.sku || "—"}</Typography></TableCell>
                                                        <TableCell align="right"><Typography variant="body2" sx={{fontWeight: 600}}>GH₵{Number(v.regular_price || v.price || 0).toFixed(2)}</Typography></TableCell>
                                                        <TableCell align="center">
                                                            {v.stock_quantity != null
                                                                ? <Chip label={v.stock_quantity} size="small" color={v.stock_quantity > 0 ? "success" : "error"} variant="outlined" sx={{height: 22, fontSize: 11}}/>
                                                                : "—"
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {productImageUrl(v) ? <Avatar variant="rounded" src={productImageUrl(v)} sx={{width: 36, height: 36}}/> : "—"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ProductDetailPage;
