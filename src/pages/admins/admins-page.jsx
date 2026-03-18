import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchAdmins, deleteAdmin, selectAdmins} from "../../redux/features/admins/admins-slice";
import {VisibilityOutlined, EditOutlined, DeleteForeverOutlined, AdminPanelSettingsOutlined, VerifiedUserOutlined, PersonOffOutlined, SupervisorAccountOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

const nameOf = (a) => a?.display_name || a?.name || (a?.first_name ? `${a.first_name} ${a.last_name || ""}`.trim() : a?.email || "—");
const initialsOf = (a) => a?.first_name && a?.last_name ? `${a.first_name[0]}${a.last_name[0]}`.toUpperCase() : (nameOf(a)?.[0] || "A").toUpperCase();
const roleColor = (role) => role === "super_admin" ? "error" : role === "admin" ? "primary" : "default";
const statusNorm = (s) => (s || "").toLowerCase();

const AdminsPage = () => {
    const dispatch = useDispatch();
    const {admins, adminLoading, adminError} = useSelector(selectAdmins);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchAdmins()); }, [dispatch]);

    const filteredAdmins = useMemo(() => {
        if (!Array.isArray(admins)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return admins;
        return admins.filter(a =>
            [a.first_name, a.last_name, a.display_name, a.email, a.username, a.role].join(" ").toLowerCase().includes(q)
        );
    }, [admins, query]);

    const handleDelete = async (admin) => {
        if (!window.confirm(`Delete admin ${nameOf(admin)}? This cannot be undone.`)) return;
        await dispatch(deleteAdmin(admin._id));
    };

    if (adminLoading && admins.length === 0) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={6}/></Box></Layout>;

    console.log(admins)

    return (
        <Layout>
            {adminLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {adminError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{adminError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Admins"
                        subtitle="Manage administrator accounts and permissions"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search admins..."
                        action={
                            <Link to="/admin/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Admin</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Admins" value={admins?.length || 0} icon={<AdminPanelSettingsOutlined/>} iconColor="secondary" iconBg="secondary" trend={5}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Active" value={admins?.filter(a => statusNorm(a.status) === "active").length || 0} icon={<VerifiedUserOutlined/>} iconColor="text.green" iconBg="light.green" trend={5}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Inactive" value={admins?.filter(a => statusNorm(a.status) === "inactive" || statusNorm(a.status) === "suspended").length || 0} icon={<PersonOffOutlined/>} iconColor="text.red" iconBg="light.red"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Super Admins" value={admins?.filter(a => a.role === "super_admin").length || 0} icon={<SupervisorAccountOutlined/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 4}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Admin</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Joined</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAdmins.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography variant="body2" color="text.secondary" align="center">No admins found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredAdmins.map((admin, i) => (
                                        <TableRow key={admin._id} hover>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Link to={`/admins/${admin._id}`} style={{textDecoration: "none"}}>
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar src={admin.avatar_url || admin.image} sx={{width: 32, height: 32, bgcolor: "secondary.main", fontSize: 13}}>
                                                            {initialsOf(admin)}
                                                        </Avatar>
                                                        <Stack>
                                                            <Typography variant="body2" sx={{fontWeight: 500, color: "text.primary"}}>{nameOf(admin)}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{admin.email}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={(admin.role || "").replace(/_/g, " ")} size="small" color={roleColor(admin.role)} sx={{textTransform: "capitalize"}}/>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={admin.status || "—"} size="small" color={statusNorm(admin.status) === "active" ? "success" : "default"} sx={{textTransform: "capitalize"}}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{(admin.date_created || admin.created_at) ? moment(admin.date_created || admin.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View">
                                                        <Link to={`/admins/${admin._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}/>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <Link to={`/admins/${admin._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}/>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteForeverOutlined onClick={() => handleDelete(admin)} sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}/>
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
        </Layout>
    );
};

export default AdminsPage;
