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
import {SearchOutlined, VisibilityOutlined, EditOutlined, DeleteForeverOutlined, Add} from "@mui/icons-material";
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
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Webhooks</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Link to="/webhook/new" style={{textDecoration: "none"}}>
                                        <Button startIcon={<Add/>} size="small" color="secondary" variant="outlined">Add Webhook</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 8}}>
                                    <Stack direction="row" spacing={1} sx={{backgroundColor: "background.paper", p: 1, borderRadius: 2}}>
                                        <TextField value={query} size="small" placeholder="Search webhooks..." onChange={e => setQuery(e.target.value)} variant="standard" slotProps={{ input: { disableUnderline: true } }} fullWidth/>
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
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Webhook">
                                                        <Link to={`/webhooks/${webhook._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Webhook">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(webhook)}
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

export default WebhooksPage;
