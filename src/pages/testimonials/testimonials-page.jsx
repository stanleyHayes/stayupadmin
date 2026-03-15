import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, FormControl,
    Grid, InputLabel, LinearProgress, MenuItem, Paper, Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTestimonials, deleteTestimonial, selectTestimonials} from "../../redux/features/testimonials/testimonials-slice";
import {
    VisibilityOutlined, DeleteForeverOutlined,
    FormatQuoteOutlined, ThumbUpOutlined, PendingOutlined, VerifiedOutlined
} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";

const statusColor = (s) => s === "approved" ? "success" : s === "pending" ? "warning" : "default";

const renderStars = (rating) => {
    const r = Number(rating) || 0;
    const full = Math.floor(r);
    const half = r % 1 >= 0.5 ? 1 : 0;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(Math.max(0, 5 - full - half));
};

const TestimonialsPage = () => {
    const dispatch = useDispatch();
    const {testimonials, testimonialLoading, testimonialError} = useSelector(selectTestimonials);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => { dispatch(fetchTestimonials()); }, [dispatch]);

    const filteredTestimonials = useMemo(() => {
        if (!Array.isArray(testimonials)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return testimonials;
        return testimonials.filter(item =>
            [item.name, item.content, item.company].join(" ").toLowerCase().includes(q)
        );
    }, [testimonials, query]);

    const handleStatusFilter = (e) => {
        const s = e.target.value;
        setStatusFilter(s);
        dispatch(fetchTestimonials({search: query, status: s}));
    };
    const handleDelete = async (t) => {
        if (!window.confirm(`Delete testimonial by ${t.name}? This cannot be undone.`)) return;
        await dispatch(deleteTestimonial(t._id));
    };

    const total = testimonials?.length || 0;
    const approvedCount = testimonials?.filter(t => t.status === "approved").length || 0;
    const pendingCount = testimonials?.filter(t => t.status === "pending").length || 0;
    const avgRating = total > 0 ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / total).toFixed(1) : "0.0";
    const verifiedCount = testimonials?.filter(t => t.is_verified).length || 0;

    return (
        <Layout>
            {testimonialLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {testimonialError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{testimonialError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Testimonials"
                        subtitle="Manage customer testimonials displayed on the website"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search testimonials..."
                        action={
                            <Link to="/testimonial/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Testimonial</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    {/* KPI Stats */}
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total" value={total} icon={<FormatQuoteOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={15}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Avg. Rating" value={`${avgRating} ★`} icon={<ThumbUpOutlined fontSize="small"/>} iconColor="text.yellow" iconBg="light.yellow"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Approved" value={approvedCount} icon={<VerifiedOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green" trend={10}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Pending" value={pendingCount} icon={<PendingOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                    </Grid>

                    {/* Filters */}
                    <Grid spacing={2} container alignItems="center" justifyContent="flex-end" sx={{mb: 2}}>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <FormControl size="small" sx={{minWidth: 130}}>
                                <InputLabel>Status</InputLabel>
                                <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
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
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Rating</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTestimonials.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No testimonials found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredTestimonials.map((t, i) => (
                                        <TableRow key={t._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar src={t.avatar} sx={{width: 28, height: 28}}/>
                                                    <Box>
                                                        <Typography variant="body2" sx={{fontWeight: 500}}>{t.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{t.location}</Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{t.product || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{fontFamily: "monospace", letterSpacing: 1, color: "text.yellow"}}>{renderStars(t.rating)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Chip label={t.status} size="small" color={statusColor(t.status)}/>
                                                    {t.is_verified && <Chip label="Verified" size="small" variant="outlined" color="info" sx={{fontSize: 10}}/>}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{t.created_at ? moment(t.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View">
                                                        <Link to={`/testimonials/${t._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}/>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteForeverOutlined onClick={() => handleDelete(t)} sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}/>
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

export default TestimonialsPage;
