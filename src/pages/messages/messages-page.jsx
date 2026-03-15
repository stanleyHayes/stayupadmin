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
import {fetchMessages, deleteMessage, selectMessages} from "../../redux/features/messages/messages-slice";
import {
    VisibilityOutlined, DeleteForeverOutlined,
    MailOutlined, MarkEmailReadOutlined, MarkEmailUnreadOutlined, HandshakeOutlined
} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";

const statusColor = (s) => s === "read" ? "success" : s === "unread" ? "info" : "default";

const MessagesPage = () => {
    const dispatch = useDispatch();
    const {messages, messageLoading, messageError} = useSelector(selectMessages);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subjectFilter, setSubjectFilter] = useState("all");

    useEffect(() => { dispatch(fetchMessages()); }, [dispatch]);

    const filteredMessages = useMemo(() => {
        if (!Array.isArray(messages)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return messages;
        return messages.filter(item =>
            [item.name, item.email, item.subject, item.message].join(" ").toLowerCase().includes(q)
        );
    }, [messages, query]);

    const handleStatusFilter = (e) => {
        const s = e.target.value;
        setStatusFilter(s);
        dispatch(fetchMessages({search: query, status: s, subject: subjectFilter}));
    };
    const handleSubjectFilter = (e) => {
        const s = e.target.value;
        setSubjectFilter(s);
        dispatch(fetchMessages({search: query, status: statusFilter, subject: s}));
    };
    const handleDelete = async (msg) => {
        if (!window.confirm(`Delete message from ${msg.name}? This cannot be undone.`)) return;
        await dispatch(deleteMessage(msg._id));
    };

    const total = messages?.length || 0;
    const unreadCount = messages?.filter(m => m.status === "unread").length || 0;
    const readCount = messages?.filter(m => m.status === "read").length || 0;
    const collabCount = messages?.filter(m => m.subject === "Collaboration / Partnerships").length || 0;

    return (
        <Layout>
            {messageLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {messageError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{messageError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Messages"
                        subtitle="Contact form submissions from the website"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search messages..."
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    {/* KPI Stats */}
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Messages" value={total} icon={<MailOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={22}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Unread" value={unreadCount} icon={<MarkEmailUnreadOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Read" value={readCount} icon={<MarkEmailReadOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Collaborations" value={collabCount} icon={<HandshakeOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                    </Grid>

                    <Grid spacing={4} container alignItems="center" justifyContent="flex-end">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <FormControl size="small" sx={{minWidth: 130}}>
                                        <InputLabel>Status</InputLabel>
                                        <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
                                            <MenuItem value="all">All</MenuItem>
                                            <MenuItem value="unread">Unread</MenuItem>
                                            <MenuItem value="read">Read</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <FormControl size="small" sx={{minWidth: 160}}>
                                        <InputLabel>Subject</InputLabel>
                                        <Select value={subjectFilter} onChange={handleSubjectFilter} label="Subject">
                                            <MenuItem value="all">All</MenuItem>
                                            <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                                            <MenuItem value="Order & Shipping">Order & Shipping</MenuItem>
                                            <MenuItem value="Returns & Refunds">Returns & Refunds</MenuItem>
                                            <MenuItem value="Collaboration / Partnerships">Collaboration</MenuItem>
                                            <MenuItem value="Feedback">Feedback</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 3}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredMessages.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No messages found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredMessages.map((msg, i) => (
                                        <TableRow key={msg._id} sx={msg.status === "unread" ? {backgroundColor: "action.hover"} : {}}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={msg.status === "unread" ? {fontWeight: 600} : {}}>{msg.name || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{msg.email || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{msg.subject || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={msg.status} size="small" color={statusColor(msg.status)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{msg.created_at ? moment(msg.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Message">
                                                        <Link to={`/messages/${msg._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Message">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(msg)}
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

export default MessagesPage;
