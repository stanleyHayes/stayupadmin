import React, { useState } from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider, FormControl,
    Grid, InputLabel, LinearProgress, MenuItem, Paper, Select, Stack,
    TextField, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { createRole, selectRoles } from "../../redux/features/roles/roles-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PermissionPicker from "../../components/shared/permission-picker.jsx";
import { DEFAULT_ROLE_TEMPLATES } from "../../utils/permissions";

const CreateRolePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { roleLoading, roleError } = useSelector(selectRoles);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [template, setTemplate] = useState("");

    const handleTemplateChange = (e) => {
        const key = e.target.value;
        setTemplate(key);
        if (key && DEFAULT_ROLE_TEMPLATES[key]) {
            const t = DEFAULT_ROLE_TEMPLATES[key];
            setName(t.name);
            setSlug(key);
            setDescription(t.description);
            setPermissions([...t.permissions]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(createRole({
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, "_"),
            description,
            permissions,
        }));
        if (!result.error) navigate("/roles");
    };

    return (
        <Layout>
            {roleLoading && <LinearProgress variant="query" color="secondary" />}
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Create Role</Typography>
                    </Stack>
                    {roleError && <Alert severity="error" sx={{ mb: 2 }}><AlertTitle>{roleError}</AlertTitle></Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Role Info</Typography>
                                    <Stack spacing={2}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Start from template</InputLabel>
                                            <Select value={template} onChange={handleTemplateChange} label="Start from template">
                                                <MenuItem value="">None</MenuItem>
                                                {Object.entries(DEFAULT_ROLE_TEMPLATES).map(([key, t]) => (
                                                    <MenuItem key={key} value={key}>{t.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Divider />
                                        <TextField size="small" label="Role name" value={name} onChange={e => setName(e.target.value)} required fullWidth />
                                        <TextField size="small" label="Slug" value={slug} onChange={e => setSlug(e.target.value)} fullWidth helperText="Auto-generated from name if left empty" />
                                        <TextField size="small" label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth multiline rows={2} />
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{ p: 3 }}>
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={roleLoading || !name}>Create Role</Button>
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

export default CreateRolePage;
