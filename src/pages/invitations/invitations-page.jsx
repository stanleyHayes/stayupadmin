import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchInvitations, deleteInvitation, selectInvitations} from "../../redux/features/invitations/invitations-slice";
import {SearchOutlined, VisibilityOutlined, EditOutlined, DeleteForeverOutlined, Add} from "@mui/icons-material";
import moment from "moment";

const statusColor = (s) => {
    if (s === "ACCEPTED") return "success";
    if (s === "PENDING") return "warning";
    if (s === "EXPIRED") return "default";
    return "default";
};

const InvitationsPage = () => {
    const dispatch = useDispatch();
    const {invitations, invitationLoading, invitationError} = useSelector(selectInvitations);
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(fetchInvitations());
    }, [dispatch]);

    const handleSearch = () => dispatch(fetchInvitations({search: query}));
    const handleDelete = async (inv) => {
        if (!window.confirm(`Delete invitation for ${inv.email}? This cannot be undone.`)) return;
        await dispatch(deleteInvitation(inv._id));
    };

    return (
        <Layout>
            {invitationLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {invitationError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{invitationError}</AlertTitle></Alert>}
                <Container>
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Invitations</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Link to="/invitation/new" style={{textDecoration: "none"}}>
                                        <Button startIcon={<Add/>} size="small" color="secondary" variant="outlined">Send Invitation</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 8}}>
                                    <Stack direction="row" spacing={1} sx={{backgroundColor: "background.paper", p: 1, borderRadius: 2}}>
                                        <TextField value={query} size="small" placeholder="Search invitations..." onChange={e => setQuery(e.target.value)} variant="standard" slotProps={{ input: { disableUnderline: true } }} fullWidth/>
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
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Invited By</TableCell>
                                        <TableCell>Expires</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invitations && invitations.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No invitations found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {invitations && invitations.map((inv, i) => (
                                        <TableRow key={inv._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{inv.email}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={(inv.role || "").replace("_", " ")} size="small"/>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={inv.status} size="small" color={statusColor(inv.status)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{inv.invited_by || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {inv.expires_at ? moment(inv.expires_at).format("ll") : "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Invitation">
                                                        <Link to={`/invitations/${inv._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Invitation">
                                                        <Link to={`/invitations/${inv._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Invitation">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(inv)}
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

export default InvitationsPage;
