// src/pages/attributes/AttributesPage.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Box, Button, Container, Divider, Grid, LinearProgress, Paper, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes, selectAttributes, deleteAttribute, fetchAttribute } from "../../redux/features/attributes/attributes-slice";

import { SearchOutlined, Visibility, Edit, Delete } from "@mui/icons-material";
import CreateAttributeDialog from "../../components/dialogs/create-attribute-dialog.jsx";
import ViewAttributeDialog from "../../components/dialogs/view-attribute-dialog.jsx";
import UpdateAttributeDialog from "../../components/dialogs/update-attribute-dialog.jsx";

const AttributesPage = () => {
    const dispatch = useDispatch();
    const { attributes, loading, error } = useSelector(selectAttributes);
    const [query, setQuery] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [activeAttr, setActiveAttr] = useState(null);

    useEffect(() => {
        dispatch(fetchAttributes());
    }, [dispatch]);

    const handleSearch = () => dispatch(fetchAttributes({ search: query }));

    const openView = async (a) => {
        setActiveAttr(a);
        await dispatch(fetchAttribute(a.id));
        setViewOpen(true);
    };

    const openEdit = async (a) => {
        setActiveAttr(a);
        await dispatch(fetchAttribute(a.id));
        setUpdateOpen(true);
    };

    const handleDelete = async (a) => {
        if (!window.confirm(`Delete attribute "${a.name}"? This cannot be undone.`)) return;
        await dispatch(deleteAttribute(a.id));
    };

    return (
        <Layout>
            {loading && <LinearProgress variant="query" color="secondary" />}
            <Box sx={{ pt: 4, pb: 8 }}>
                <Container>
                    <Grid spacing={4} container={true} alignItems="center" justifyContent="space-between">
                        <Grid item={true} size={{ xs: 12, md: "auto" }}>
                            <Grid container={true} spacing={2} alignItems="center">
                                <Grid item={true} size={{ xs: 12, md: "auto" }}>
                                    <Typography variant="h4" sx={{ color: "text.secondary" }}>Product attributes</Typography>
                                </Grid>
                                <Grid item={true} size={{ xs: 12, md: "auto" }}>
                                    <Button size="small" color="secondary" variant="outlined" onClick={() => setCreateOpen(true)}>Add attribute</Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item={true} size={{ xs: 12, md: "auto" }}>
                            <Grid container={true} spacing={2} alignItems="center">
                                <Grid item={true} size={{ xs: 12, md: 8 }}>
                                    <Stack direction="row" spacing={1} sx={{ backgroundColor: "background.paper", p: 1, borderRadius: 2 }}>
                                        <TextField value={query} size="small" placeholder="Search attributes..." onChange={(e) => setQuery(e.target.value)} variant="standard" InputProps={{ disableUnderline: true }} fullWidth />
                                        <SearchOutlined onClick={handleSearch} sx={{ cursor: "pointer", alignSelf: "center" }} />
                                    </Stack>
                                </Grid>
                                <Grid item={true} size={{ xs: 12, md: 4 }}>
                                    <Button size="small" color="secondary" variant="outlined" fullWidth onClick={handleSearch}>Search</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Slug</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Order by</TableCell>
                                        <TableCell>Archives</TableCell>
                                        <TableCell>Terms</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attributes && attributes.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8}><Typography variant="body2" color="text.secondary" align="center">No attributes available</Typography></TableCell>
                                        </TableRow>
                                    )}

                                    {attributes && attributes.map((a, i) => (
                                        <TableRow key={a.id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{a.name}</TableCell>
                                            <TableCell>{a.slug}</TableCell>
                                            <TableCell>{a.type}</TableCell>
                                            <TableCell>{a.order_by}</TableCell>
                                            <TableCell>{a.has_archives ? "Yes" : "No"}</TableCell>
                                            <TableCell>{a.terms_count ?? 0}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <IconButton size="small" onClick={() => openView(a)}><Visibility fontSize="small" /></IconButton>
                                                    <IconButton size="small" onClick={() => openEdit(a)}><Edit fontSize="small" /></IconButton>
                                                    <IconButton size="small" onClick={() => handleDelete(a)}><Delete fontSize="small" /></IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </Box>

            <CreateAttributeDialog open={createOpen} onClose={() => setCreateOpen(false)} />
            <ViewAttributeDialog open={viewOpen} onClose={() => setViewOpen(false)} />
            <UpdateAttributeDialog open={updateOpen} onClose={() => setUpdateOpen(false)} />
        </Layout>
    );
};

export default AttributesPage;
