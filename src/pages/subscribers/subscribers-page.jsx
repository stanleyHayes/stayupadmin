import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Box, Chip, Container, Divider, FormControl,
    Grid, InputLabel, LinearProgress, MenuItem, Paper, Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchSubscribers, deleteSubscriber, selectSubscribers} from "../../redux/features/subscribers/subscribers-slice";
import {
    VisibilityOutlined, DeleteForeverOutlined,
    SubscriptionsOutlined, CheckCircleOutlined, UnsubscribeOutlined, ErrorOutlineOutlined
} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";

const statusColor = (s) => s === "active" ? "success" : s === "unsubscribed" ? "warning" : s === "bounced" ? "error" : "default";

const SubscribersPage = () => {
    const dispatch = useDispatch();
    const {subscribers, subscriberLoading, subscriberError} = useSelector(selectSubscribers);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => { dispatch(fetchSubscribers()); }, [dispatch]);

    const filteredSubscribers = useMemo(() => {
        if (!Array.isArray(subscribers)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return subscribers;
        return subscribers.filter(item =>
            [item.email, item.name].join(" ").toLowerCase().includes(q)
        );
    }, [subscribers, query]);

    const handleStatusFilter = (e) => {
        const s = e.target.value;
        setStatusFilter(s);
        dispatch(fetchSubscribers({search: query, status: s}));
    };
    const handleDelete = async (subscriber) => {
        if (!window.confirm(`Remove subscriber ${subscriber.email}? This cannot be undone.`)) return;
        await dispatch(deleteSubscriber(subscriber._id));
    };

    const total = subscribers?.length || 0;
    const activeCount = subscribers?.filter(s => s.status === "active").length || 0;
    const unsubCount = subscribers?.filter(s => s.status === "unsubscribed").length || 0;
    const bouncedCount = subscribers?.filter(s => s.status === "bounced").length || 0;

    return (
        <Layout>
            {subscriberLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {subscriberError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{subscriberError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Subscribers"
                        subtitle="Manage newsletter subscribers"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search subscribers..."
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    {/* KPI Stats */}
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Subscribers" value={total} icon={<SubscriptionsOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={18}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Active" value={activeCount} icon={<CheckCircleOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green" trend={12}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Unsubscribed" value={unsubCount} icon={<UnsubscribeOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange" trend={-3}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Bounced" value={bouncedCount} icon={<ErrorOutlineOutlined fontSize="small"/>} iconColor="text.red" iconBg="light.red"/>
                        </Grid>
                    </Grid>

                    <Grid spacing={4} container alignItems="center" justifyContent="flex-end">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <FormControl size="small" sx={{minWidth: 130}}>
                                <InputLabel>Status</InputLabel>
                                <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
                                    <MenuItem value="bounced">Bounced</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 3}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Source</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Subscribed</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSubscribers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography variant="body2" color="text.secondary" align="center">No subscribers found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredSubscribers.map((sub, i) => (
                                        <TableRow key={sub._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{sub.email || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{textTransform: "capitalize"}}>{sub.source || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={sub.status} size="small" color={statusColor(sub.status)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{sub.created_at ? moment(sub.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Subscriber">
                                                        <Link to={`/subscribers/${sub._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Subscriber">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(sub)}
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

export default SubscribersPage;
