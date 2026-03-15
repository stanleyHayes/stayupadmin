import React, {useEffect} from "react";
import {
    Avatar,
    Box,
    Button,
    CardMedia,
    Chip,
    Container,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchProduct, selectProducts} from "../../redux/features/products/products-slice";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5, flexWrap: "wrap"}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>
            {label}
        </Typography>
        <Typography variant="body2">{value !== undefined && value !== null && value !== "" ? value : "—"}</Typography>
    </Box>
);

// Handles both string ("0.15") and object ({ amount, unit }) formats from seed/API
const formatWeight = (w) => {
    if (!w) return "—";
    if (typeof w === "object") return `${w.amount ?? ""} ${w.unit ?? "g"}`.trim();
    return `${w} g`;
};

// Handles both string ("20") and object ({ amount, unit }) dimension values
const formatDimension = (v) => {
    if (!v && v !== 0) return "—";
    if (typeof v === "object") return `${v.amount ?? ""}${v.unit ?? ""}`;
    return String(v);
};

const formatDimensions = (d) => {
    if (!d) return "—";
    const l = formatDimension(d.length);
    const w = formatDimension(d.width);
    const h = formatDimension(d.height);
    if (l === "—" && w === "—" && h === "—") return "—";
    return `${l} × ${w} × ${h} cm`;
};

const ProductDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {productID} = useParams();
    const {product, products, productLoading} = useSelector(selectProducts);

    useEffect(() => {
        if (productID) dispatch(fetchProduct(productID));
    }, [dispatch, productID]);

    // Fall back to already-loaded list item when there is no live API
    const p = product ||
        (Array.isArray(products) ? products.find(x => String(x._id) === String(productID)) : null) ||
        {};

    // Price display: show sale price as main when on sale, regular as struck-through
    const isOnSale = Boolean(p.sale?.status);
    const displayPrice = isOnSale
        ? (p.sale?.price ? `${p.sale.price.currency} ${p.sale.price.amount}` : null)
        : (p.price ? `${p.price.currency} ${p.price.amount}` : null);
    const struckPrice = isOnSale && p.price ? `${p.price.currency} ${p.price.amount}` : null;

    return (
        <Layout>
            {productLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 8}}>
                <Container>
                    {/* Page header */}
                    <Stack
                        direction={{xs: "column", sm: "row"}}
                        spacing={2}
                        alignItems={{xs: "flex-start", sm: "center"}}
                        justifyContent="space-between"
                        sx={{mb: 3}}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">
                                Back
                            </Button>
                            <Typography variant="h5" sx={{fontWeight: 700}}>Product details</Typography>
                        </Stack>

                        <Link to={`/products/${productID}/update`} style={{textDecoration: "none"}}>
                            <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">
                                Edit product
                            </Button>
                        </Link>
                    </Stack>

                    <Grid container spacing={3}>
                        {/* Image */}
                        <Grid item size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Images</Typography>
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        {p.image?.secure_url || p.image?.preview ? (
                                            <CardMedia
                                                component="img"
                                                image={p.image?.secure_url ?? p.image?.preview}
                                                alt={p.title ?? "Product image"}
                                                sx={{width: "100%", maxWidth: 360, objectFit: "contain", borderRadius: 0}}
                                            />
                                        ) : (
                                            <Box sx={{
                                                width: "100%", height: 200,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                bgcolor: "background.alternative", borderRadius: 0
                                            }}>
                                                <ImageNotSupportedIcon sx={{fontSize: 48, color: "text.muted"}}/>
                                            </Box>
                                        )}
                                    </Box>

                                    <Divider/>

                                    <Typography variant="subtitle2" sx={{fontWeight: 600}}>Gallery</Typography>
                                    <Stack direction="row" spacing={1} sx={{flexWrap: "wrap", gap: 1}}>
                                        {p.gallery && p.gallery.length > 0 ? (
                                            p.gallery.map((g, i) => (
                                                <Avatar
                                                    key={i}
                                                    variant="rounded"
                                                    src={g.secure_url ?? g.preview}
                                                    sx={{width: 64, height: 64, borderRadius: 1}}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">No gallery images</Typography>
                                        )}
                                    </Stack>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Main info */}
                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="h6" sx={{fontWeight: 700}}>
                                            {p.title ?? "Untitled product"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            SKU: {p.sku ?? "—"}
                                        </Typography>
                                    </Box>

                                    <Divider/>

                                    {/* Pricing */}
                                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                        <Box>
                                            <Typography variant="h5" sx={{fontWeight: 700}}>
                                                {displayPrice ?? "—"}
                                            </Typography>
                                            {struckPrice && (
                                                <Typography variant="body2" color="text.secondary" sx={{textDecoration: "line-through"}}>
                                                    {struckPrice}
                                                </Typography>
                                            )}
                                        </Box>
                                        {isOnSale && (
                                            <Box>
                                                <Chip label="On Sale" color="secondary" size="small"/>
                                                {(p.sale?.start_date || p.sale?.end_date) && (
                                                    <Typography variant="caption" color="text.secondary" display="block" sx={{mt: 0.5}}>
                                                        {p.sale.start_date ? `From ${moment(p.sale.start_date).format("LL")}` : ""}
                                                        {p.sale.end_date ? ` to ${moment(p.sale.end_date).format("LL")}` : ""}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </Stack>

                                    <Divider/>

                                    {/* Description */}
                                    <Box>
                                        <Typography variant="subtitle2" sx={{mb: 0.5, fontWeight: 600}}>Short description</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{whiteSpace: "pre-wrap"}}>
                                            {p.short_description || "—"}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{mb: 0.5, fontWeight: 600}}>Description</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{whiteSpace: "pre-wrap"}}>
                                            {p.description || "—"}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Inventory */}
                        <Grid item size={{xs: 12, sm: 6, lg: 4}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Inventory</Typography>
                                <Stack spacing={0.5}>
                                    <InfoRow label="Stock quantity" value={p.stock_quantity ?? "—"}/>
                                    <InfoRow label="Stock status" value={p.stock_status ?? "—"}/>
                                    <InfoRow label="Manage stock" value={p.manage_stock ? "Yes" : "No"}/>
                                    <InfoRow label="Allow backorders" value={p.backorders ?? (p.allow_back_orders ? "yes" : "no")}/>
                                    <InfoRow label="Sold individually" value={p.sold_individually ? "Yes" : "No"}/>
                                    <InfoRow label="Low stock threshold" value={p.low_stock_threshold ?? "—"}/>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Shipping */}
                        <Grid item size={{xs: 12, sm: 6, lg: 4}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Shipping</Typography>
                                <Stack spacing={0.5}>
                                    <InfoRow label="Weight" value={formatWeight(p.weight)}/>
                                    <InfoRow label="Dimensions" value={formatDimensions(p.dimensions)}/>
                                    <InfoRow label="Shipping class" value={p.shipping_class ?? "—"}/>
                                    <InfoRow label="Tax status" value={p.tax_status ?? "—"}/>
                                    <InfoRow label="Tax class" value={p.tax_class || "Standard"}/>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Visibility & meta */}
                        <Grid item size={{xs: 12, sm: 6, lg: 4}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Visibility & meta</Typography>
                                <Stack spacing={0.5}>
                                    <InfoRow label="Status" value={p.status ?? "—"}/>
                                    <InfoRow label="Visibility" value={p.visibility ?? "—"}/>
                                    <InfoRow label="Featured" value={p.featured ? "Yes" : "No"}/>
                                    <InfoRow label="Reviews allowed" value={p.reviews_allowed ? "Yes" : "No"}/>
                                    <InfoRow label="Type" value={p.type ?? "—"}/>
                                    <InfoRow label="Created" value={p.created_at ? moment(p.created_at).format("ll") : "—"}/>
                                    <InfoRow label="Updated" value={p.updated_at ? moment(p.updated_at).format("ll") : "—"}/>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Categories & tags */}
                        <Grid item size={{xs: 12, sm: 6}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 600}}>Categories</Typography>
                                        <Stack direction="row" spacing={1} sx={{flexWrap: "wrap", gap: 1}}>
                                            {p.categories && p.categories.length > 0 ? (
                                                p.categories.map((c) => (
                                                    <Chip key={c.id ?? c._id ?? c.name} label={c.name ?? c} size="small"/>
                                                ))
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">No categories</Typography>
                                            )}
                                        </Stack>
                                    </Box>

                                    <Divider/>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 600}}>Tags</Typography>
                                        <Stack direction="row" spacing={1} sx={{flexWrap: "wrap", gap: 1}}>
                                            {p.tags && p.tags.length > 0 ? (
                                                p.tags.map((t, i) => (
                                                    <Chip key={i} label={t?.name ?? t} size="small"/>
                                                ))
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">No tags</Typography>
                                            )}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Linked products */}
                        <Grid item size={{xs: 12, sm: 6}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle2" sx={{mb: 2, fontWeight: 600}}>Linked products</Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600, display: "block", mb: 0.5}}>
                                            Upsells
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{flexWrap: "wrap", gap: 1}}>
                                            {p.upsells && p.upsells.length > 0
                                                ? p.upsells.map((u, i) => <Chip key={i} label={u?.name ?? u} size="small"/>)
                                                : <Typography variant="caption" color="text.secondary">None</Typography>
                                            }
                                        </Stack>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600, display: "block", mb: 0.5}}>
                                            Cross-sells
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{flexWrap: "wrap", gap: 1}}>
                                            {p.cross_sells && p.cross_sells.length > 0
                                                ? p.cross_sells.map((c, i) => <Chip key={i} label={c?.name ?? c} size="small"/>)
                                                : <Typography variant="caption" color="text.secondary">None</Typography>
                                            }
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Variations */}
                        {p.variations && p.variations.length > 0 && (
                            <Grid item size={{xs: 12}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Variations</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Attributes</TableCell>
                                                    <TableCell>SKU</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Stock</TableCell>
                                                    <TableCell>Image</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {p.variations.map((v, i) => (
                                                    <TableRow key={v.id ?? i}>
                                                        <TableCell>
                                                            {(v.attributes || []).map(a => `${a.name}: ${a.value}`).join(" / ") || "—"}
                                                        </TableCell>
                                                        <TableCell>{v.sku ?? "—"}</TableCell>
                                                        <TableCell>
                                                            {typeof v.price === "object"
                                                                ? `${v.price.currency} ${v.price.amount}`
                                                                : v.price
                                                                    ? `${p.price?.currency ?? ""} ${v.price}`.trim()
                                                                    : "—"}
                                                        </TableCell>
                                                        <TableCell>{v.stock_quantity ?? "—"}</TableCell>
                                                        <TableCell>
                                                            {v.image?.secure_url ? (
                                                                <Avatar variant="rounded" src={v.image.secure_url} sx={{width: 48, height: 48}}/>
                                                            ) : (
                                                                <Typography variant="caption" color="text.secondary">—</Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ProductDetailPage;
