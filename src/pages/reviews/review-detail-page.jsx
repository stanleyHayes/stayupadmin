import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchReview, updateReview, deleteReview, selectReviews} from "../../redux/features/reviews/reviews-slice";
import {fetchProducts, selectProducts} from "../../redux/features/products/products-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import moment from "moment";
import {DetailSkeleton} from "../../components/shared/page-skeleton.jsx";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2" component="div">{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => s === "approved" ? "success" : s === "pending" ? "warning" : s === "spam" ? "error" : "default";

const reviewerName = (r) => {
    if (!r) return "—";
    if (typeof r === "string") return r;
    if (r.name) return r.name;
    if (r.first_name) return `${r.first_name} ${r.last_name || ""}`.trim();
    return r.email || "—";
};

const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return "★".repeat(r) + "☆".repeat(Math.max(0, 5 - r));
};

const ReviewDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {reviewID} = useParams();
    const {review, reviewLoading, reviewError} = useSelector(selectReviews);
    const {products} = useSelector(selectProducts);

    useEffect(() => {
        if (reviewID) dispatch(fetchReview(reviewID));
        dispatch(fetchProducts());
    }, [dispatch, reviewID]);

    const handleApprove = () => dispatch(updateReview({id: reviewID, data: {status: "approved"}}));
    const handleSpam = () => dispatch(updateReview({id: reviewID, data: {status: "spam"}}));
    const handleDelete = async () => {
        if (!window.confirm("Delete this review? This cannot be undone.")) return;
        await dispatch(deleteReview(reviewID));
        navigate("/reviews");
    };

    if (reviewLoading && !review) return <Layout><Box sx={{pt: 4, pb: 6}}><DetailSkeleton/></Box></Layout>;

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
                                <InfoRow label="Product" value={(() => {
                                    const pid = rv.product_id;
                                    const id = typeof pid === "object" ? (pid?._id || pid?.id) : pid;
                                    let name = typeof pid === "object" ? (pid?.name || pid?.title) : null;
                                    if (!name && id && Array.isArray(products)) {
                                        const found = products.find(p => String(p._id) === String(id) || String(p.id) === String(id));
                                        if (found) name = found.name || found.title;
                                    }
                                    name = name || rv.product_name || "—";
                                    return id ? <Link to={`/products/${id}`} style={{textDecoration: "none", color: "inherit"}}>{name}</Link> : name;
                                })()}/>
                                <InfoRow label="Reviewer" value={reviewerName(rv.reviewer)}/>
                                <InfoRow label="Email" value={typeof rv.reviewer === "object" ? rv.reviewer?.email : rv.reviewer_email}/>
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
