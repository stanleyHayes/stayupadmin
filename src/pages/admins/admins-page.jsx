import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchAdmins, deleteAdmin, selectAdmins} from "../../redux/features/admins/admins-slice";
import {VisibilityOutlined, EditOutlined, DeleteForeverOutlined, AdminPanelSettingsOutlined, VerifiedUserOutlined, PersonOffOutlined, SupervisorAccountOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";

const AdminsPage = () => {
    const dispatch = useDispatch();
    const {admins, adminLoading, adminError} = useSelector(selectAdmins);
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(fetchAdmins());
    }, [dispatch]);

    const filteredAdmins = useMemo(() => {
        if (!Array.isArray(admins)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return admins;
        return admins.filter(item =>
            [item.name, item.email, item.username, item.role].join(" ").toLowerCase().includes(q)
        );
    }, [admins, query]);

    const handleDelete = async (admin) => {
        if (!window.confirm(`Delete admin ${admin.firstName} ${admin.lastName}? This cannot be undone.`)) return;
        await dispatch(deleteAdmin(admin._id));
    };

    const roleColor = (role) => {
        if (role === "super_admin") return "error";
        if (role === "admin") return "primary";
        return "default";
    };

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
                            <KPIBox label="Active" value={admins?.filter(a => (a.status || "ACTIVE") === "ACTIVE").length || 0} icon={<VerifiedUserOutlined/>} iconColor="text.green" iconBg="light.green" trend={5}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Inactive" value={admins?.filter(a => a.status === "INACTIVE").length || 0} icon={<PersonOffOutlined/>} iconColor="text.red" iconBg="light.red"/>
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
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Joined</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAdmins.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No admins found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredAdmins.map((admin, i) => (
                                        <TableRow key={admin._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{width: 32, height: 32, bgcolor: "secondary.main", fontSize: 14}}>
                                                        {(admin.firstName || "?")[0].toUpperCase()}
                                                    </Avatar>
                                                    <Typography variant="body2">{admin.firstName} {admin.lastName}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{admin.email}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={(admin.role || "").replace("_", " ")} size="small" color={roleColor(admin.role)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={admin.status} size="small" color={admin.status === "ACTIVE" ? "success" : "default"}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{admin.created_at ? moment(admin.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Admin">
                                                        <Link to={`/admins/${admin._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Admin">
                                                        <Link to={`/admins/${admin._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Admin">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(admin)}
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
        </Layout>
    );
};

export default AdminsPage;
