// src/pages/tags/TagsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
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
    Tooltip,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, selectTags, deleteTag, fetchTag } from "../../redux/features/tags/tags-slice";
import { VisibilityOutlined, EditOutlined, DeleteForeverOutlined, TagOutlined, LocalOfferOutlined, TrendingUpOutlined } from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
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

    const filteredTags = useMemo(() => {
        if (!Array.isArray(tags)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return tags;
        return tags.filter(item =>
            [item.name, item.slug].join(" ").toLowerCase().includes(q)
        );
    }, [tags, query]);

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
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>
                    <PageHeader
                        title="Tags"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search tags..."
                        action={
                            <Link to="/tag/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Tag</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Total Tags" value={tags?.length || 0} icon={<LocalOfferOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={10}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="With Products" value={tags?.filter(t => t.count > 0).length || 0} icon={<TrendingUpOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Empty Tags" value={tags?.filter(t => !t.count || t.count === 0).length || 0} icon={<TagOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
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
                                    {filteredTags.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography variant="body2" color="text.secondary" align="center">No tags available</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {filteredTags.map((t, i) => (
                                        <TableRow key={t.id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{t.name}</TableCell>
                                            <TableCell>{t.slug}</TableCell>
                                            <TableCell>{t.count ?? 0}</TableCell>
                                            <TableCell style={{ maxWidth: 320, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Tag">
                                                        <VisibilityOutlined
                                                            onClick={() => openView(t)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Edit Tag">
                                                        <EditOutlined
                                                            onClick={() => openEdit(t)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Delete Tag">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(t)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
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
