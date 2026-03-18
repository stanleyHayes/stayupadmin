import React from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider,
    Grid, LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { deleteRole, selectRoles } from "../../redux/features/roles/roles-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShieldIcon from "@mui/icons-material/Shield";
import { PERMISSION_GROUPS } from "../../utils/permissions";
import {DetailSkeleton} from "../../components/shared/page-skeleton.jsx";

const RoleDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { roleID } = useParams();
    const { roles, roleLoading, roleError } = useSelector(selectRoles);
    const role = roles?.find(r => (r._id || r.id) === roleID) || null;

    if (roleLoading && !role) return <Layout><Box sx={{pt: 4, pb: 6}}><DetailSkeleton/></Box></Layout>;

    const handleDelete = async () => {
        if (!window.confirm(`Delete role "${role?.name}"?`)) return;
        await dispatch(deleteRole(roleID));
        navigate("/roles");
    };

    const perms = new Set(role?.permissions || []);

    return (
        <Layout>
            {roleLoading && <LinearProgress variant="query" color="secondary" />}
            <Box sx={{ pt: 4, pb: 6 }}>
                {roleError && <Alert severity="error" sx={{ mb: 2 }}><AlertTitle>{roleError}</AlertTitle></Alert>}
                {!role && !roleLoading && <Alert severity="warning" sx={{ mb: 2 }}><AlertTitle>Role not found</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Role Details</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/roles/${roleID}/update`} style={{ textDecoration: "none" }}>
                                <Button startIcon={<EditIcon />} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon />} variant="outlined" color="error" size="small" onClick={handleDelete} disabled={!role}>Delete</Button>
                        </Stack>
                    </Stack>

                    {role && (
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
                                    <ShieldIcon sx={{ fontSize: 56, color: "secondary.main", mb: 1 }} />
                                    <Typography variant="h5" sx={{ mb: 0.5 }}>{role.name}</Typography>
                                    <Chip label={role.slug} size="small" variant="outlined" sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">{role.description || "No description"}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {(role.permissions || []).length} permissions assigned
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Paper elevation={0} sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Assigned Permissions</Typography>
                                    {PERMISSION_GROUPS.map((group, gi) => {
                                        const groupPerms = group.permissions.filter(p => perms.has(p.key));
                                        if (groupPerms.length === 0) return null;
                                        return (
                                            <Box key={gi} sx={{ mb: 2 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                                                    {group.label}
                                                </Typography>
                                                <Stack direction="row" flexWrap="wrap" sx={{ mt: 0.5, gap: 0.5 }}>
                                                    {groupPerms.map(p => (
                                                        <Chip key={p.key} label={p.label} size="small" color="secondary" variant="outlined" />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        );
                                    })}
                                    {(role.permissions || []).length === 0 && (
                                        <Typography variant="body2" color="text.secondary">No permissions assigned</Typography>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default RoleDetailPage;
