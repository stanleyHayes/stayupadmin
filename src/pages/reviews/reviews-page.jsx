import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, FormControl,
    Grid, InputLabel, LinearProgress, MenuItem, Paper, Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchReviews, deleteReview, selectReviews} from "../../redux/features/reviews/reviews-slice";
import {VisibilityOutlined, DeleteForeverOutlined, RateReviewOutlined, ThumbUpOutlined, PendingOutlined, ReportOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import moment from "moment";

const statusColor = (s) => s === "approved" ? "success" : s === "pending" ? "warning" : s === "spam" ? "error" : "default";

const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return "★".repeat(r) + "☆".repeat(Math.max(0, 5 - r));
};

const ReviewsPage = () => {
    const dispatch = useDispatch();
    const {reviews, reviewLoading, reviewError} = useSelector(selectReviews);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => { dispatch(fetchReviews()); }, [dispatch]);

    const filteredReviews = useMemo(() => {
        if (!Array.isArray(reviews)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return reviews;
        return reviews.filter(item =>
            [item.reviewer, item.review, item.product_name].join(" ").toLowerCase().includes(q)
        );
    }, [reviews, query]);

    const handleStatusFilter = (e) => {
        const s = e.target.value;
        setStatusFilter(s);
        dispatch(fetchReviews({search: query, status: s}));
    };
    const handleDelete = async (review) => {
        if (!window.confirm(`Delete review by ${review.reviewer}? This cannot be undone.`)) return;
        await dispatch(deleteReview(review._id));
    };

    return (
        <Layout>
            {reviewLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {reviewError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{reviewError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Reviews"
                        subtitle="Moderate and manage product reviews"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search reviews..."
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Reviews" value={reviews?.length || 0} icon={<RateReviewOutlined/>} iconColor="secondary" iconBg="secondary" trend={10}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Approved" value={reviews?.filter(r => r.status === "approved").length || 0} icon={<ThumbUpOutlined/>} iconColor="text.green" iconBg="light.green" trend={8}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Pending" value={reviews?.filter(r => r.status === "pending").length || 0} icon={<PendingOutlined/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Spam" value={reviews?.filter(r => r.status === "spam").length || 0} icon={<ReportOutlined/>} iconColor="text.red" iconBg="light.red" trend={-15}/>
                        </Grid>
                    </Grid>
                    <Grid spacing={2} container alignItems="center" justifyContent="flex-end" sx={{mb: 2}}>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <FormControl size="small" sx={{minWidth: 130}}>
                                <InputLabel>Status</InputLabel>
                                <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="spam">Spam</MenuItem>
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
                                        <TableCell>Product</TableCell>
                                        <TableCell>Reviewer</TableCell>
                                        <TableCell>Rating</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredReviews.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No reviews found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredReviews.map((review, i) => (
                                        <TableRow key={review._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{review.product_name || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{review.reviewer || "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{fontFamily: "monospace", letterSpacing: 1}}>{renderStars(review.rating)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={review.status} size="small" color={statusColor(review.status)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{review.created_at ? moment(review.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Review">
                                                        <Link to={`/reviews/${review._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Review">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(review)}
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

export default ReviewsPage;
