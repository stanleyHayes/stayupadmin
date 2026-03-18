import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchInvitations, deleteInvitation, selectInvitations} from "../../redux/features/invitations/invitations-slice";
import {VisibilityOutlined, EditOutlined, DeleteForeverOutlined, MailOutlined, CheckCircleOutlined, PendingOutlined, CancelOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

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

    const filteredInvitations = useMemo(() => {
        if (!Array.isArray(invitations)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return invitations;
        return invitations.filter(item =>
            [item.email, item.role, item.status].join(" ").toLowerCase().includes(q)
        );
    }, [invitations, query]);

    const handleDelete = async (inv) => {
        if (!window.confirm(`Delete invitation for ${inv.email}? This cannot be undone.`)) return;
        await dispatch(deleteInvitation(inv._id));
    };

    if (invitationLoading && invitations.length === 0) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={6}/></Box></Layout>;

    return (
        <Layout>
            {invitationLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {invitationError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{invitationError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Invitations"
                        subtitle="Track and manage admin invitations"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search invitations..."
                        action={
                            <Link to="/invitation/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Invitation</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Invitations" value={invitations?.length || 0} icon={<MailOutlined/>} iconColor="secondary" iconBg="secondary" trend={8}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Accepted" value={invitations?.filter(i => i.status === "accepted").length || 0} icon={<CheckCircleOutlined/>} iconColor="text.green" iconBg="light.green" trend={6}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Pending" value={invitations?.filter(i => i.status === "pending").length || 0} icon={<PendingOutlined/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Expired" value={invitations?.filter(i => i.status === "expired").length || 0} icon={<CancelOutlined/>} iconColor="text.red" iconBg="light.red" trend={-3}/>
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
                                    {filteredInvitations.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No invitations found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredInvitations.map((inv, i) => (
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
                                                <Typography variant="body2" color="text.secondary">{typeof inv.invited_by === "object" ? (inv.invited_by?.display_name || inv.invited_by?.name || (inv.invited_by?.first_name ? `${inv.invited_by.first_name} ${inv.invited_by.last_name || ""}`.trim() : inv.invited_by?.email || "—")) : (inv.invited_by || "—")}</Typography>
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
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Invitation">
                                                        <Link to={`/invitations/${inv._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Invitation">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(inv)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
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
