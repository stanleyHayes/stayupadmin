// src/pages/attributes/AttributesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Box, Button, Container, Divider, Grid, LinearProgress, Paper, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes, selectAttributes, deleteAttribute, fetchAttribute } from "../../redux/features/attributes/attributes-slice";

import { VisibilityOutlined, EditOutlined, DeleteForeverOutlined, AccountTreeOutlined, ListAltOutlined, TuneOutlined } from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
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

    const filteredAttributes = useMemo(() => {
        if (!Array.isArray(attributes)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return attributes;
        return attributes.filter(item =>
            [item.name, item.slug].join(" ").toLowerCase().includes(q)
        );
    }, [attributes, query]);

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
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>
                    <PageHeader
                        title="Attributes"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search attributes..."
                        action={
                            <Link to="/attribute/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Attribute</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Total Attributes" value={attributes?.length || 0} icon={<AccountTreeOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={6}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Select Type" value={attributes?.filter(a => a.type === "select").length || 0} icon={<ListAltOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Color Type" value={attributes?.filter(a => a.type === "color").length || 0} icon={<TuneOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
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
                                    {filteredAttributes.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8}><Typography variant="body2" color="text.secondary" align="center">No attributes available</Typography></TableCell>
                                        </TableRow>
                                    )}

                                    {filteredAttributes.map((a, i) => (
                                        <TableRow key={a.id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{a.name}</TableCell>
                                            <TableCell>{a.slug}</TableCell>
                                            <TableCell>{a.type}</TableCell>
                                            <TableCell>{a.order_by}</TableCell>
                                            <TableCell>{a.has_archives ? "Yes" : "No"}</TableCell>
                                            <TableCell>{a.terms_count ?? 0}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Attribute">
                                                        <VisibilityOutlined
                                                            onClick={() => openView(a)}
                                                            sx={{ padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer" }}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Edit Attribute">
                                                        <EditOutlined
                                                            onClick={() => openEdit(a)}
                                                            sx={{ padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer" }}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Delete Attribute">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(a)}
                                                            sx={{ padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer" }}
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

            <CreateAttributeDialog open={createOpen} onClose={() => setCreateOpen(false)} />
            <ViewAttributeDialog open={viewOpen} onClose={() => setViewOpen(false)} />
            <UpdateAttributeDialog open={updateOpen} onClose={() => setUpdateOpen(false)} />
        </Layout>
    );
};

export default AttributesPage;
