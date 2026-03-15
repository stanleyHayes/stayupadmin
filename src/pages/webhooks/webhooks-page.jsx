import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchWebhooks, deleteWebhook, selectWebhooks} from "../../redux/features/webhooks/webhooks-slice";
import {VisibilityOutlined, EditOutlined, DeleteForeverOutlined, LinkOutlined, CheckCircleOutlined, PauseCircleOutlined, HttpOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";

const statusColor = (s) => s === "active" ? "success" : s === "paused" ? "warning" : "default";

const WebhooksPage = () => {
    const dispatch = useDispatch();
    const {webhooks, webhookLoading, webhookError} = useSelector(selectWebhooks);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchWebhooks()); }, [dispatch]);

    const handleSearch = () => dispatch(fetchWebhooks({search: query}));
    const handleDelete = async (webhook) => {
        if (!window.confirm(`Delete webhook "${webhook.name}"? This cannot be undone.`)) return;
        await dispatch(deleteWebhook(webhook._id));
    };

    return (
        <Layout>
            {webhookLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {webhookError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{webhookError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Webhooks"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search webhooks..."
                        action={
                            <Link to="/webhook/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Webhook</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Webhooks" value={webhooks?.length || 0} icon={<LinkOutlined/>} iconColor="secondary" iconBg="secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Active" value={webhooks?.filter(w => w.status === "active").length || 0} icon={<CheckCircleOutlined/>} iconColor="text.green" iconBg="light.green" trend={5}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Paused" value={webhooks?.filter(w => w.status === "paused" || w.status === "disabled").length || 0} icon={<PauseCircleOutlined/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Endpoints" value={webhooks?.length || 0} icon={<HttpOutlined/>} iconColor="text.blue" iconBg="light.blue"/>
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
                                        <TableCell>Topic</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Delivery URL</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {webhooks && webhooks.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography variant="body2" color="text.secondary" align="center">No webhooks found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {webhooks && webhooks.map((webhook, i) => (
                                        <TableRow key={webhook._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell><Typography variant="body2">{webhook.name || "—"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary">{webhook.topic || "—"}</Typography></TableCell>
                                            <TableCell>
                                                <Chip label={webhook.status} size="small" color={statusColor(webhook.status)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" sx={{maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                    {webhook.delivery_url || "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Webhook">
                                                        <Link to={`/webhooks/${webhook._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Webhook">
                                                        <Link to={`/webhooks/${webhook._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Webhook">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(webhook)}
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

export default WebhooksPage;
