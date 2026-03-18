import React, { useEffect, useState } from "react";
import {
    Alert, AlertTitle, Box, Button, Checkbox, Container, Divider,
    FormControl, FormControlLabel, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, TextField, Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdmin, updateAdmin, selectAdmins } from "../../redux/features/admins/admins-slice";
import { fetchRoles, selectRoles } from "../../redux/features/roles/roles-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFormik } from "formik";
import * as Yup from "yup";
import PermissionPicker from "../../components/shared/permission-picker.jsx";

const UpdateAdminPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { adminID } = useParams();
    const { admin, adminLoading, adminError } = useSelector(selectAdmins);
    const { roles } = useSelector(selectRoles);
    const [customPermissions, setCustomPermissions] = useState(false);
    const [permissionOverrides, setPermissionOverrides] = useState([]);

    useEffect(() => {
        if (adminID) dispatch(fetchAdmin(adminID));
        dispatch(fetchRoles());
    }, [dispatch, adminID]);

    useEffect(() => {
        if (admin) {
            formik.setValues({
                first_name: admin.first_name || "",
                last_name: admin.last_name || "",
                email: admin.email || "",
                username: admin.username || "",
                phone: admin.phone || "",
                role: admin.role || "",
                status: admin.status || "ACTIVE",
            });
            if (admin.permission_overrides && admin.permission_overrides.length > 0) {
                setCustomPermissions(true);
                setPermissionOverrides(admin.permission_overrides);
            } else {
                setCustomPermissions(false);
                const selectedRole = roles?.find(r => (r._id ?? r.id ?? r.slug) === admin.role);
                setPermissionOverrides(selectedRole?.permissions || []);
            }
        }
    }, [admin, roles]);

    const formik = useFormik({
        initialValues: { first_name: "", last_name: "", email: "", username: "", phone: "", role: "", status: "ACTIVE" },
        validationSchema: Yup.object({
            first_name: Yup.string().required("First name is required"),
            last_name: Yup.string().required("Last name is required"),
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            username: Yup.string().required("Username is required"),
        }),
        onSubmit: async (values) => {
            const payload = { ...values };
            if (customPermissions) {
                payload.permission_overrides = permissionOverrides;
            } else {
                payload.permission_overrides = [];
            }
            const result = await dispatch(updateAdmin({ id: adminID, data: payload }));
            if (!result.error) navigate(`/admins/${adminID}`);
        }
    });

    const handleRoleChange = (e) => {
        formik.handleChange(e);
        const selectedRole = roles?.find(r => (r._id ?? r.id ?? r.slug) === e.target.value);
        if (selectedRole && !customPermissions) {
            setPermissionOverrides(selectedRole.permissions || []);
        }
    };

    const field = (name, label, opts = {}) => (
        <TextField name={name} label={label} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched[name] && formik.errors[name])} helperText={formik.touched[name] && formik.errors[name]} size="small" fullWidth {...opts} />
    );

    return (
        <Layout>
            {adminLoading && <LinearProgress variant="query" color="secondary" />}
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                        <Typography variant="h5">Edit Admin</Typography>
                    </Stack>
                    {adminError && <Alert severity="error" sx={{ mb: 2 }}><AlertTitle>{adminError}</AlertTitle></Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Paper elevation={0} sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Personal Information</Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>{field("first_name", "First name")}</Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>{field("last_name", "Last name")}</Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>{field("email", "Email address")}</Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>{field("username", "Username")}</Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>{field("phone", "Phone number")}</Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Role & Status</Typography>
                                    <Stack spacing={2}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Role</InputLabel>
                                            <Select name="role" value={formik.values.role} onChange={handleRoleChange} label="Role">
                                                {(roles || []).map(r => (
                                                    <MenuItem key={r._id ?? r.id} value={r._id ?? r.id ?? r.slug}>
                                                        {r.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select name="status" value={formik.values.status} onChange={formik.handleChange} label="Status">
                                                <MenuItem value="ACTIVE">Active</MenuItem>
                                                <MenuItem value="PENDING">Pending</MenuItem>
                                                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Paper>
                                <Paper elevation={0} sx={{ p: 3 }}>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={1}>
                                        <Button type="submit" variant="contained" color="secondary" fullWidth disabled={adminLoading}>Save Changes</Button>
                                        <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>Cancel</Button>
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Paper elevation={0} sx={{ p: 3 }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Permission Overrides</Typography>
                                        <FormControlLabel
                                            control={<Checkbox checked={customPermissions} onChange={e => setCustomPermissions(e.target.checked)} color="secondary" />}
                                            label={<Typography variant="body2">Customize permissions for this admin</Typography>}
                                        />
                                    </Stack>
                                    {!customPermissions && (
                                        <Typography variant="body2" color="text.secondary">
                                            This admin inherits permissions from their assigned role. Enable custom permissions to override.
                                        </Typography>
                                    )}
                                    {customPermissions && (
                                        <PermissionPicker value={permissionOverrides} onChange={setPermissionOverrides} />
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Box>
        </Layout>
    );
};

export default UpdateAdminPage;
