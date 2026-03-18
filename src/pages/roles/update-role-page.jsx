import React, { useEffect, useState } from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Grid,
    LinearProgress, Paper, Stack, TextField, Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { updateRole, selectRoles } from "../../redux/features/roles/roles-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PermissionPicker from "../../components/shared/permission-picker.jsx";

const UpdateRolePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { roleID } = useParams();
    const { roles, roleLoading, roleError } = useSelector(selectRoles);
    const role = roles?.find(r => (r._id || r.id) === roleID) || null;

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        if (role) {
            setName(role.name || "");
            setSlug(role.slug || "");
            setDescription(role.description || "");
            setPermissions(role.permissions || []);
        }
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateRole({ id: roleID, data: { name, slug, description, permissions } }));
        if (!result.error) navigate(`/roles/${roleID}`);
    };

    return (
        <Layout>
            {roleLoading && <LinearProgress variant="query" color="secondary" />}
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Edit Role</Typography>
                    </Stack>
                    {roleError && <Alert severity="error" sx={{ mb: 2 }}><AlertTitle>{roleError}</AlertTitle></Alert>}
                    {!role && !roleLoading && <Alert severity="warning" sx={{ mb: 2 }}><AlertTitle>Role not found</AlertTitle></Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Role Info</Typography>
                                    <Stack spacing={2}>
                                        <TextField size="small" label="Role name" value={name} onChange={e => setName(e.target.value)} required fullWidth />
                                        <TextField size="small" label="Slug" value={slug} onChange={e => setSlug(e.target.value)} fullWidth />
                                        <TextField size="small" label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth multiline rows={2} />
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{ p: 3 }}>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={roleLoading || !name}>Save Changes</Button>
                                        <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>Cancel</Button>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Paper elevation={0} sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Permissions</Typography>
                                    <PermissionPicker value={permissions} onChange={setPermissions} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>
        </Layout>
    );
};

export default UpdateRolePage;
