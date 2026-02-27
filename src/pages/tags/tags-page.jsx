// src/pages/tags/TagsPage.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Box,
    Button,
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
    TextField,
    Typography,
    IconButton
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, selectTags, deleteTag, fetchTag } from "../../redux/features/tags/tags-slice";
import { SearchOutlined, Visibility, Edit, Delete } from "@mui/icons-material";
import CreateTagDialog from "../../components/dialogs/create-tag-dialog.jsx";
import ViewTagDialog from "../../components/dialogs/view-tag-dialog.jsx";
import UpdateTagDialog from "../../components/dialogs/update-tag-dialog.jsx";


const TagsPage = () => {
    const dispatch = useDispatch();
    const { tags, loading, error } = useSelector(selectTags);
    const [query, setQuery] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [activeTag, setActiveTag] = useState(null);

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const handleSearch = async () => {
        dispatch(fetchTags({ search: query }));
    };

    const openView = async (tag) => {
        setActiveTag(tag);
        await dispatch(fetchTag(tag.id));
        setViewOpen(true);
    };

    const openEdit = async (t) => {
        setActiveTag(t);
        await dispatch(fetchTag(t.id));
        setUpdateOpen(true);
    };

    const handleDelete = async (t) => {
        if (!window.confirm(`Delete tag "${t.name}"? This cannot be undone.`)) return;
        await dispatch(deleteTag(t.id));
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
                                    <Typography variant="h4" sx={{ color: "text.secondary" }}>Product tags</Typography>
                                </Grid>
                                <Grid item={true} size={{ xs: 12, md: "auto" }}>
                                    <Button size="small" color="secondary" variant="outlined" onClick={() => setCreateOpen(true)}>Add tag</Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item={true} size={{ xs: 12, md: "auto" }}>
                            <Grid container={true} spacing={2} alignItems="center">
                                <Grid item={true} size={{ xs: 12, md: 8 }}>
                                    <Stack direction="row" spacing={1} sx={{ backgroundColor: "background.paper", p: 1, borderRadius: 2 }}>
                                        <TextField value={query} size="small" placeholder="Search tags..." onChange={(e) => setQuery(e.target.value)} variant="standard" InputProps={{ disableUnderline: true }} fullWidth />
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
                                        <TableCell>Count</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {tags && tags.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography variant="body2" color="text.secondary" align="center">No tags available</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {tags && tags.map((t, i) => (
                                        <TableRow key={t.id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{t.name}</TableCell>
                                            <TableCell>{t.slug}</TableCell>
                                            <TableCell>{t.count ?? 0}</TableCell>
                                            <TableCell style={{ maxWidth: 320, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <IconButton size="small" onClick={() => openView(t)}><Visibility fontSize="small"/></IconButton>
                                                    <IconButton size="small" onClick={() => openEdit(t)}><Edit fontSize="small"/></IconButton>
                                                    <IconButton size="small" onClick={() => handleDelete(t)}><Delete fontSize="small"/></IconButton>
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

            <CreateTagDialog open={createOpen} onClose={() => setCreateOpen(false)} />
            <ViewTagDialog open={viewOpen} onClose={() => setViewOpen(false)} />
            <UpdateTagDialog open={updateOpen} onClose={() => setUpdateOpen(false)} />
        </Layout>
    );
};

export default TagsPage;
