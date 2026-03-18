import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, FormControl,
    Grid, InputLabel, LinearProgress, MenuItem, Paper, Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tooltip, Typography
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
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return "★".repeat(Math.floor(r)) + "☆".repeat(Math.max(0, 5 - Math.floor(r)));
};

const TestimonialsPage = () => {
    const dispatch = useDispatch();
    const {testimonials, testimonialLoading, testimonialError} = useSelector(selectTestimonials);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => { dispatch(fetchTestimonials()); }, [dispatch]);

    const filtered = useMemo(() => {
        if (!Array.isArray(testimonials)) return [];
        let result = [...testimonials];
        if (filter === "active") result = result.filter(t => t.is_active);
        if (filter === "inactive") result = result.filter(t => !t.is_active);
        if (filter === "verified") result = result.filter(t => t.is_verified);
        const q = query.trim().toLowerCase();
        if (q) result = result.filter(t => [t.name, t.content, t.product, t.location, t.role].join(" ").toLowerCase().includes(q));
        return result;
    }, [testimonials, query, filter]);

    const handleDelete = async (t) => {
        if (!window.confirm(`Delete testimonial by ${t.name}?`)) return;
        await dispatch(deleteTestimonial(t._id));
    };

    const total = testimonials?.length || 0;
    const activeCount = testimonials?.filter(t => t.is_active).length || 0;
    const verifiedCount = testimonials?.filter(t => t.is_verified).length || 0;
    const avgRating = total > 0 ? (testimonials.reduce((sum, t) => sum + (Number(t.rating) || 0), 0) / total).toFixed(1) : "0.0";

    if (testimonialLoading && (!testimonials || testimonials.length === 0)) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={7}/></Box></Layout>;

    return (
        <Layout>
            {testimonialLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {testimonialError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{testimonialError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Testimonials"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search testimonials..."
                    />
                    <Divider sx={{my: 3}}/>

                    <Grid container spacing={2} sx={{mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total" value={total} icon={<FormatQuoteOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Avg Rating" value={`${avgRating} ★`} icon={<ThumbUpOutlined fontSize="small"/>} iconColor="text.yellow" iconBg="light.yellow"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Active" value={activeCount} icon={<VerifiedOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Verified" value={verifiedCount} icon={<PendingOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={2} sx={{mb: 3}}>
                        <FormControl size="small" sx={{minWidth: 120}}>
                            <InputLabel>Filter</InputLabel>
                            <Select value={filter} onChange={e => setFilter(e.target.value)} label="Filter">
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                                <MenuItem value="verified">Verified</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

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
                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No testimonials found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filtered.map((t, i) => (
                                        <TableRow key={t._id} hover>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar src={t.avatar_url} sx={{width: 32, height: 32}}>{(t.name || "?")[0].toUpperCase()}</Avatar>
                                                    <Box>
                                                        <Typography variant="body2" sx={{fontWeight: 500}}>{t.name || "—"}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{t.role || t.location || ""}</Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{t.product || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{fontFamily: "monospace", letterSpacing: 1, color: "text.yellow"}}>{renderStars(t.rating)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Chip label={t.is_active ? "Active" : "Inactive"} size="small" color={t.is_active ? "success" : "default"}/>
                                                    {t.is_verified && <Chip label="Verified" size="small" variant="outlined" color="info" sx={{fontSize: 10}}/>}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{(t.created_at || t.date_created) ? moment(t.created_at || t.date_created).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View">
                                                        <Link to={`/testimonials/${t._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}/>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteForeverOutlined onClick={() => handleDelete(t)} sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}/>
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
