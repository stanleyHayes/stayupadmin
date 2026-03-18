import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import { Close, VisibilityOutlined, EditOutlined, DeleteForeverOutlined, ShieldOutlined } from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../../components/shared/empty.jsx";
import { fetchRoles, deleteRole, selectRoles } from "../../redux/features/roles/roles-slice";
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

const RolesPage = () => {
    const dispatch = useDispatch();
    const { roles = [], roleLoading, roleError } = useSelector(selectRoles);
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    const filtered = useMemo(() => {
        if (!Array.isArray(roles)) return [];
        const q = (query || "").trim().toLowerCase();
        if (!q) return roles;
        return roles.filter(r =>
            (r.name || "").toLowerCase().includes(q) ||
            (r.slug || "").toLowerCase().includes(q) ||
            (r.description || "").toLowerCase().includes(q)
        );
    }, [roles, query]);

    const handleDelete = (role) => {
        if (!window.confirm(`Delete role "${role.name}"? Admins using this role will lose their permissions.`)) return;
        dispatch(deleteRole(role._id ?? role.id));
    };

    if (roleLoading && roles.length === 0) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={6}/></Box></Layout>;

    return (
        <Layout>
            {roleLoading && <LinearProgress variant="query" color="secondary" />}
            <Box sx={{ pt: 4, pb: 6 }}>
                {roleError && <Alert severity="error" sx={{ mb: 2 }}><AlertTitle>{roleError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Roles & Permissions"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search roles..."
                        action={
                            <Link to="/role/new" style={{ textDecoration: "none" }}>
                                <Button size="small" color="secondary" variant="contained">Create Role</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{ my: 3 }} />

                    {filtered.length === 0 ? (
                        <Empty
                            icon={<ShieldOutlined sx={{ padding: 1, fontSize: 36, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary" }} />}
                            title="Roles"
                            message="No roles defined yet"
                            button={
                                <Link to="/role/new" style={{ textDecoration: "none" }}>
                                    <Button size="small" color="secondary" variant="outlined">Create Role</Button>
                                </Link>
                            }
                        />
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Slug</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Permissions</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filtered.map((r, idx) => (
                                        <TableRow hover key={r._id ?? r.id ?? idx}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2">{r.name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={r.slug || r.name || "—"} size="small" variant="outlined" sx={{fontFamily: "monospace", fontSize: 11}} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{r.description || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={`${(r.permissions || []).length} permissions`} size="small" color="secondary" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Tooltip title="View">
                                                        <Link to={`/roles/${r._id ?? r.id}`}>
                                                            <VisibilityOutlined sx={{ padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer" }} />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <Link to={`/roles/${r._id ?? r.id}/update`}>
                                                            <EditOutlined sx={{ padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer" }} />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteForeverOutlined onClick={() => handleDelete(r)} sx={{ padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer" }} />
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default RolesPage;
