import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchAdmins, deleteAdmin, selectAdmins} from "../../redux/features/admins/admins-slice";
import {SearchOutlined, VisibilityOutlined, EditOutlined, DeleteForeverOutlined, Add} from "@mui/icons-material";
import moment from "moment";

const AdminsPage = () => {
    const dispatch = useDispatch();
    const {admins, adminLoading, adminError} = useSelector(selectAdmins);
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(fetchAdmins());
    }, [dispatch]);

    const handleSearch = () => dispatch(fetchAdmins({search: query}));
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
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Admins</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Link to="/admin/new" style={{textDecoration: "none"}}>
                                        <Button startIcon={<Add/>} size="small" color="secondary" variant="outlined">Add Admin</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 8}}>
                                    <Stack direction="row" spacing={1} sx={{backgroundColor: "background.paper", p: 1, borderRadius: 2}}>
                                        <TextField value={query} size="small" placeholder="Search admins..." onChange={e => setQuery(e.target.value)} variant="standard" slotProps={{ input: { disableUnderline: true } }} fullWidth/>
                                        <SearchOutlined onClick={handleSearch} sx={{cursor: "pointer", alignSelf: "center"}}/>
                                    </Stack>
                                </Grid>
                                <Grid size={{xs: 12, md: 4}}>
                                    <Button size="small" color="secondary" variant="outlined" fullWidth onClick={handleSearch}>Search</Button>
                                </Grid>
                            </Grid>
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
                                    {admins && admins.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No admins found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {admins && admins.map((admin, i) => (
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
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Admin">
                                                        <Link to={`/admins/${admin._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Admin">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(admin)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
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
