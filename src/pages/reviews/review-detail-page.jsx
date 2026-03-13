import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchReview, updateReview, deleteReview, selectReviews} from "../../redux/features/reviews/reviews-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import moment from "moment";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => s === "approved" ? "success" : s === "pending" ? "warning" : s === "spam" ? "error" : "default";

const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return "★".repeat(r) + "☆".repeat(Math.max(0, 5 - r));
};

const ReviewDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {reviewID} = useParams();
    const {review, reviewLoading, reviewError} = useSelector(selectReviews);

    useEffect(() => {
        if (reviewID) dispatch(fetchReview(reviewID));
    }, [dispatch, reviewID]);

    const handleApprove = () => dispatch(updateReview({id: reviewID, data: {status: "approved"}}));
    const handleSpam = () => dispatch(updateReview({id: reviewID, data: {status: "spam"}}));
    const handleDelete = async () => {
        if (!window.confirm("Delete this review? This cannot be undone.")) return;
        await dispatch(deleteReview(reviewID));
        navigate("/reviews");
    };

    const rv = review || {};

    return (
        <Layout>
            {reviewLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {reviewError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{reviewError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Review</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button startIcon={<CheckCircleIcon/>} variant="outlined" color="success" size="small" onClick={handleApprove} disabled={rv.status === "approved"}>Approve</Button>
                            <Button startIcon={<BlockIcon/>} variant="outlined" color="warning" size="small" onClick={handleSpam} disabled={rv.status === "spam"}>Mark Spam</Button>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Review Details</Typography>
                                <InfoRow label="Product" value={
                                    rv.product_id ? (
                                        <Link to={`/products/${rv.product_id}`} style={{textDecoration: "none", color: "inherit"}}>{rv.product_name || rv.product_id}</Link>
                                    ) : (rv.product_name || "—")
                                }/>
                                <InfoRow label="Reviewer" value={rv.reviewer}/>
                                <InfoRow label="Email" value={rv.reviewer_email}/>
                                <InfoRow label="Rating" value={<span style={{fontFamily: "monospace", letterSpacing: 1}}>{renderStars(rv.rating)} ({rv.rating}/5)</span>}/>
                                <InfoRow label="Created" value={rv.created_at ? moment(rv.created_at).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Review Text</Typography>
                                <Typography variant="body2" sx={{mt: 1, whiteSpace: "pre-wrap"}}>{rv.review || rv.content || "—"}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                <Stack spacing={1}>
                                    <Chip label={rv.status || "—"} size="small" color={statusColor(rv.status)}/>
                                    {rv.verified && <Chip label="Verified Purchase" size="small" color="info" variant="outlined"/>}
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ReviewDetailPage;
