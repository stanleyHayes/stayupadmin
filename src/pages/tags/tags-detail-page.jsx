// src/pages/tags/TagDetailPage.jsx
import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
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
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchTag, selectTags } from "../../redux/features/tags/tags-slice.js";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";

const MetaRow = ({ label, value }) => (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 120 }}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const TagDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { tag, loading } = useSelector(selectTags);
    const [products, setProducts] = useState([]); // placeholder: wire to real selector / API if available

    useEffect(() => {
        if (id) dispatch(fetchTag(id));
    }, [dispatch, id]);

    // If you have an API to list products by tag id, fetch them here and setProducts.
    // For now it stays empty so UI shows a helpful message.

    return (
        <Layout>
            <Container sx={{ py: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Tag details</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button component={RouterLink} to={`/tags`} variant="outlined" size="small">All tags</Button>
                        <Button component={RouterLink} to={`/tags/${id}/edit`} startIcon={<EditIcon />} variant="contained" color="secondary" size="small">Edit</Button>
                    </Stack>
                </Stack>

                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Card elevation={0}>
                            <CardHeader title={tag?.name || "—"} subheader={tag?.slug || "—"} />
                            <CardContent>
                                <MetaRow label="ID" value={tag?.id} />
                                <MetaRow label="Count" value={tag?.count ?? 0} />
                                <MetaRow label="Created at" value={tag?.created_at ? moment(tag.created_at).format("LLL") : tag?.created ? moment(tag.created).format("LLL") : "—"} />
                                <MetaRow label="Updated at" value={tag?.updated_at ? moment(tag.updated_at).format("LLL") : tag?.modified ? moment(tag.modified).format("LLL") : "—"} />

                                {tag?._links && (
                                    <>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Links</Typography>
                                        <Stack spacing={1}>
                                            {Object.keys(tag._links).map((k) =>
                                                (tag._links[k] || []).map((ln, i) => (
                                                    <Button key={`${k}-${i}`} startIcon={<LinkIcon />} size="small" href={ln.href} target="_blank" rel="noopener noreferrer" sx={{ justifyContent: "flex-start" }}>
                                                        {k} — {ln.href}
                                                    </Button>
                                                ))
                                            )}
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 8 }}>
                        <Paper elevation={0} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">Description</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
                                {tag?.description || "No description provided."}
                            </Typography>
                        </Paper>

                        <Box sx={{ mt: 2 }}>
                            <Paper elevation={0} sx={{ p: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle1">Products using this tag</Typography>
                                    <Typography variant="caption" color="text.secondary">{products.length} results</Typography>
                                </Stack>

                                <Divider sx={{ my: 1 }} />

                                {products.length === 0 ? (
                                    <Typography variant="caption" color="text.secondary">No products are loaded for this tag. If you have a products API that supports filtering by tag id, wire it to fetch products here.</Typography>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>SKU</TableCell>
                                                    <TableCell>Price</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {products.map((p, i) => (
                                                    <TableRow key={p.id || i}>
                                                        <TableCell>{i + 1}</TableCell>
                                                        <TableCell>{p.title}</TableCell>
                                                        <TableCell>{p.sku}</TableCell>
                                                        <TableCell>{p.price ? `${p.price.currency} ${p.price.amount}` : "—"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default TagDetailPage;
