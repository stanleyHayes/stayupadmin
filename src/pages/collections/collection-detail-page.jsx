import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchCollection, deleteCollection, selectCollections} from "../../redux/features/collections/collections-slice";
import {productImageUrl} from "../../utils/helpers.js";
import {ArrowBack, Edit, Delete, ImageNotSupported} from "@mui/icons-material";
import {DetailSkeleton} from "../../components/shared/page-skeleton.jsx";
import moment from "moment";

const CollectionDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {collectionID} = useParams();
    const {collection, collectionLoading, collectionError} = useSelector(selectCollections);

    useEffect(() => { if (collectionID) dispatch(fetchCollection(collectionID)); }, [dispatch, collectionID]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this collection?")) return;
        await dispatch(deleteCollection(collectionID));
        navigate("/collections");
    };

    if (collectionLoading && !collection) return <Layout><Box sx={{pt: 4, pb: 6}}><DetailSkeleton/></Box></Layout>;

    const c = collection || {};
    const img = typeof c.image === "object" ? (c.image?.secure_url || c.image?.url || c.image?.src) : c.image;
    const products = c.products || [];

    return (
        <Layout>
            {collectionLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {collectionError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{collectionError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction={{xs: "column", sm: "row"}} justifyContent="space-between" alignItems={{xs: "stretch", sm: "center"}} sx={{mb: 3}} spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} size="small" variant="outlined">Back</Button>
                            <Typography variant="h5" sx={{fontWeight: 800}}>{c.name || "Collection"}</Typography>
                            {c.featured && <Chip label="Featured" size="small" color="warning" sx={{height: 22, fontSize: 10}}/>}
                            {!c.is_active && <Chip label="Inactive" size="small" color="default" sx={{height: 22, fontSize: 10}}/>}
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/collections/${collectionID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<Edit/>} variant="contained" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<Delete/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={4}>
                        {/* Image + info */}
                        <Grid size={{xs: 12, md: 5}}>
                            <Paper elevation={0} sx={{overflow: "hidden", mb: 3}}>
                                <Box sx={{height: 280, backgroundColor: "background.alternative", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    {img ? (
                                        <Box component="img" src={img} alt={c.name} sx={{width: "100%", height: "100%", objectFit: "cover"}}/>
                                    ) : (
                                        <ImageNotSupported sx={{fontSize: 64, color: "action.disabled"}}/>
                                    )}
                                </Box>
                            </Paper>
                            <Paper elevation={0} sx={{p: 2.5}}>
                                <Stack spacing={1.5}>
                                    {c.slug && (
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="caption" color="text.secondary">Slug</Typography>
                                            <Typography variant="body2" sx={{fontFamily: "monospace"}}>/{c.slug}</Typography>
                                        </Stack>
                                    )}
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">Products</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 600}}>{products.length}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">Status</Typography>
                                        <Chip label={c.is_active ? "Active" : "Inactive"} size="small" color={c.is_active ? "success" : "default"} sx={{height: 22, fontSize: 11}}/>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">Featured</Typography>
                                        <Typography variant="body2">{c.featured ? "Yes" : "No"}</Typography>
                                    </Stack>
                                    {c.created_at && (
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="caption" color="text.secondary">Created</Typography>
                                            <Typography variant="body2">{moment(c.created_at).format("MMM D, YYYY")}</Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Description + products */}
                        <Grid size={{xs: 12, md: 7}}>
                            {c.description && (
                                <Paper elevation={0} sx={{p: 2.5, mb: 3}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 1}}>Description</Typography>
                                    <Typography variant="body2" sx={{lineHeight: 1.8, whiteSpace: "pre-wrap"}}>{c.description}</Typography>
                                </Paper>
                            )}

                            <Paper elevation={0} sx={{overflow: "hidden"}}>
                                <Box sx={{px: 2.5, py: 2, backgroundColor: "background.alternative"}}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Products in Collection</Typography>
                                        <Chip label={products.length} size="small" color="secondary" sx={{height: 20, fontSize: 11, fontWeight: 700}}/>
                                    </Stack>
                                </Box>
                                {products.length > 0 ? (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>SKU</TableCell>
                                                    <TableCell align="right">Price</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {products.map((p, i) => {
                                                    const prod = typeof p === "object" ? p : {_id: p};
                                                    const pImg = productImageUrl(prod);
                                                    return (
                                                        <TableRow key={prod._id || i} hover>
                                                            <TableCell>
                                                                <Link to={`/products/${prod._id}`} style={{textDecoration: "none", color: "inherit"}}>
                                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                                        <Avatar variant="rounded" src={pImg} sx={{width: 36, height: 36}}>{(prod.name || "?")[0]}</Avatar>
                                                                        <Typography variant="body2" sx={{fontWeight: 500}}>{prod.name || prod.title || `#${String(prod._id).slice(-6)}`}</Typography>
                                                                    </Stack>
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell><Typography variant="caption" sx={{fontFamily: "monospace"}}>{prod.sku || "—"}</Typography></TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2" sx={{fontWeight: 500}}>
                                                                    {prod.regular_price ? `GH₵${Number(prod.regular_price).toFixed(2)}` : "—"}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                {prod.stock_status && <Chip label={prod.stock_status} size="small" color={prod.stock_status === "instock" ? "success" : "error"} variant="outlined" sx={{height: 22, fontSize: 10}}/>}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Box sx={{p: 4, textAlign: "center"}}>
                                        <Typography variant="body2" color="text.secondary">No products added yet</Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default CollectionDetailPage;
