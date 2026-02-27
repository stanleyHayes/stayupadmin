// src/pages/products/ProductDetailViewPage.jsx
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

/**
 * Product detail (read-only) view for admin
 * - Uses selectProducts from products slice
 * - Dispatches fetchProduct(id) on mount if id present
 * - Grid items use: size={{ xs: 12, md: "auto" }}
 */

const MetaRow = ({ label, value }) => (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 120 }}>
            {label}
        </Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const ProductDetailViewPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // could be sku or id
    const { product, productLoading } = useSelector(selectProducts);

    useEffect(() => {
        if (id) {
            dispatch(fetchProduct(id));
        }
    }, [dispatch, id]);

    const p = product || {};

    return (
        <Layout>
            <Container sx={{ py: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" size="small">
                            Back
                        </Button>
                        <Typography variant="h5">Product details</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Link to={`/product/${id}/edit`} style={{ textDecoration: "none" }}>
                            <Button startIcon={<EditIcon />} variant="contained" color="secondary" size="small">
                                Edit product
                            </Button>
                        </Link>
                    </Stack>
                </Stack>

                <Grid container spacing={2}>
                    {/* Left column: images + gallery */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{ p: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Images
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {p.image?.secure_url || p.image?.preview ? (
                                        <CardMedia
                                            component="img"
                                            image={p.image?.secure_url ?? p.image?.preview}
                                            alt={p.title ?? "Product image"}
                                            sx={{ width: "100%", maxWidth: 380, objectFit: "contain", borderRadius: 1 }}
                                        />
                                    ) : (
                                        <Box sx={{ width: "100%", height: 220, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default", borderRadius: 1 }}>
                                            <ImageNotSupportedIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                                        </Box>
                                    )}
                                </Box>

                                <Divider />

                                <Typography variant="subtitle2">Gallery</Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                                    {(p.gallery && p.gallery.length > 0) ? (
                                        p.gallery.map((g, i) => (
                                            <Avatar
                                                key={i}
                                                variant="rounded"
                                                src={g.secure_url ?? g.preview}
                                                sx={{ width: 72, height: 72, borderRadius: 1 }}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">No gallery images</Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Middle column: main product info */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{ p: 2 }}>
                            <Stack spacing={1}>
                                <Typography variant="h6">{p.title ?? "Untitled product"}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    SKU: {p.sku ?? "—"}
                                </Typography>

                                <Divider sx={{ my: 1 }} />

                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            {p.price ? `${p.price.currency} ${p.price.amount}` : "—"}
                                        </Typography>
                                        {p.sale?.status && p.sale?.price?.amount ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                                                {p.price ? `${p.price.currency} ${p.price.amount}` : ""}
                                            </Typography>
                                        ) : null}
                                    </Box>

                                    {p.sale?.status ? (
                                        <Box>
                                            <Chip label="On Sale" color="secondary" size="small" />
                                            {p.sale?.start_date || p.sale?.end_date ? (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {p.sale.start_date ? `From ${moment(p.sale.start_date).format("LL")}` : ""} {p.sale.end_date ? `to ${moment(p.sale.end_date).format("LL")}` : ""}
                                                </Typography>
                                            ) : null}
                                        </Box>
                                    ) : null}
                                </Stack>

                                <Divider />

                                <Typography variant="subtitle2">Short description</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                                    {p.short_description ?? "—"}
                                </Typography>

                                <Divider />

                                <Typography variant="subtitle2">Description</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                                    {p.description ?? "—"}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Right column: inventory & shipping & meta */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">Inventory</Typography>
                            <Stack spacing={1} sx={{ mt: 1 }}>
                                <MetaRow label="Stock quantity" value={p.stock_quantity ?? "—"} />
                                <MetaRow label="Allow backorders" value={p.allow_back_orders ? "Yes" : "No"} />
                                <MetaRow label="Sold individually" value={p.sold_individually ? "Yes" : "No"} />
                                <MetaRow label="Low stock threshold" value={p.low_stock_threshold ?? "—"} />
                                <Divider />
                                <Typography variant="subtitle1">Shipping</Typography>
                                <MetaRow label="Weight" value={p.weight ? `${p.weight.amount} ${p.weight.unit ?? "g"}` : "—"} />
                                <MetaRow label="Dimensions" value={(p.dimensions && p.dimensions.length && p.dimensions.width && p.dimensions.height) ? `${p.dimensions.length.amount}${p.dimensions.length.unit} × ${p.dimensions.width.amount}${p.dimensions.width.unit} × ${p.dimensions.height.amount}${p.dimensions.height.unit}` : "—"} />
                                <Divider />
                                <Typography variant="subtitle1">Visibility & status</Typography>
                                <MetaRow label="Status" value={p.status ?? "—"} />
                                <MetaRow label="Visibility" value={p.visibility ?? "—"} />
                                <MetaRow label="Featured" value={p.featured ? "Yes" : "No"} />
                                <Divider />
                                <Typography variant="subtitle1">Meta</Typography>
                                <MetaRow label="Created at" value={p.created_at ? moment(p.created_at).format("LLL") : "—"} />
                                <MetaRow label="Updated at" value={p.updated_at ? moment(p.updated_at).format("LLL") : "—"} />
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Full width: categories, tags, linked products */}
                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <Paper elevation={0} sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item size={{ xs: 12, md: "auto" }}>
                                    <Typography variant="subtitle1">Categories</Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                                        {p.categories && p.categories.length > 0 ? (
                                            p.categories.map((c) => <Chip key={c.id ?? c._id ?? c.name} label={c.name ?? c} />)
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">No categories</Typography>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item size={{ xs: 12, md: "auto" }}>
                                    <Typography variant="subtitle1">Tags</Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                                        {p.tags && p.tags.length > 0 ? (
                                            p.tags.map((t, i) => <Chip key={i} label={t} />)
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">No tags</Typography>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item size={{ xs: 12, md: "auto" }}>
                                    <Typography variant="subtitle1">Linked products</Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Upsells</Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                {p.upsells && p.upsells.length > 0 ? p.upsells.map((u, i) => <Chip key={i} label={u} />) : <Typography variant="caption" color="text.secondary">None</Typography>}
                                            </Stack>
                                        </Box>

                                        <Box sx={{ ml: 2 }}>
                                            <Typography variant="caption" color="text.secondary">Cross-sells</Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                {p.cross_sells && p.cross_sells.length > 0 ? p.cross_sells.map((c, i) => <Chip key={i} label={c} />) : <Typography variant="caption" color="text.secondary">None</Typography>}
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Variations table */}
                    <Grid item size={{ xs: 12, md: "auto" }}>
                        <Paper elevation={0} sx={{ p: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Variations
                            </Typography>
                            {p.variations && p.variations.length > 0 ? (
                                <TableContainer component={Paper} elevation={0}>
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
                                                    <TableCell>{(v.attributes || []).map(a => `${a.name}:${a.value}`).join(" / ")}</TableCell>
                                                    <TableCell>{v.sku ?? "—"}</TableCell>
                                                    <TableCell>{typeof v.price === "object" ? `${v.price.currency} ${v.price.amount}` : (v.price ? `${p.price?.currency ?? ""} ${v.price}` : "—")}</TableCell>
                                                    <TableCell>{v.stock_quantity ?? "—"}</TableCell>
                                                    <TableCell>
                                                        {v.image?.secure_url ? (
                                                            <Avatar variant="rounded" src={v.image.secure_url} sx={{ width: 56, height: 56 }} />
                                                        ) : (
                                                            <Typography variant="caption" color="text.secondary">No image</Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography variant="caption" color="text.secondary">No variations for this product</Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default ProductDetailViewPage;
