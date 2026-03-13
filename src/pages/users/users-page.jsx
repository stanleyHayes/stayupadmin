import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchUsers, deleteUser, selectUsers} from "../../redux/features/users/users-slice";
import {SearchOutlined, VisibilityOutlined, EditOutlined, DeleteForeverOutlined, Add} from "@mui/icons-material";
import moment from "moment";

const UsersPage = () => {
    const dispatch = useDispatch();
    const {users, userLoading, userError} = useSelector(selectUsers);
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSearch = () => dispatch(fetchUsers({search: query}));
    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user ${user.firstName} ${user.lastName}? This cannot be undone.`)) return;
        await dispatch(deleteUser(user._id));
    };

    return (
        <Layout>
            {userLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {userError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{userError}</AlertTitle></Alert>}
                <Container>
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Users</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Link to="/user/new" style={{textDecoration: "none"}}>
                                        <Button startIcon={<Add/>} size="small" color="secondary" variant="outlined">Add User</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 8}}>
                                    <Stack direction="row" spacing={1} sx={{backgroundColor: "background.paper", p: 1, borderRadius: 2}}>
                                        <TextField value={query} size="small" placeholder="Search users..." onChange={e => setQuery(e.target.value)} variant="standard" slotProps={{ input: { disableUnderline: true } }} fullWidth/>
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
                                    {users && users.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No users found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {users && users.map((user, i) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{width: 32, height: 32, bgcolor: "secondary.light", fontSize: 14}}>
                                                        {(user.firstName || "?")[0].toUpperCase()}
                                                    </Avatar>
                                                    <Typography variant="body2">{user.firstName} {user.lastName}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={user.role || "customer"} size="small"/>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={user.status} size="small" color={user.status === "ACTIVE" ? "success" : user.status === "PENDING" ? "warning" : "default"}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{user.created_at ? moment(user.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View User">
                                                        <Link to={`/users/${user._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit User">
                                                        <Link to={`/users/${user._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete User">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(user)}
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

export default UsersPage;
