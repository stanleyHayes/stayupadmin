import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTestimonial, updateTestimonial, deleteTestimonial, selectTestimonials} from "../../redux/features/testimonials/testimonials-slice";
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

const statusColor = (s) => s === "approved" ? "success" : s === "pending" ? "warning" : "default";

const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return "★".repeat(Math.floor(r)) + (r % 1 >= 0.5 ? "½" : "") + "☆".repeat(Math.max(0, 5 - Math.ceil(r)));
};

const TestimonialDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {testimonialID} = useParams();
    const {testimonial, testimonialLoading, testimonialError} = useSelector(selectTestimonials);

    useEffect(() => {
        if (testimonialID) dispatch(fetchTestimonial(testimonialID));
    }, [dispatch, testimonialID]);

    const handleApprove = () => dispatch(updateTestimonial({id: testimonialID, data: {status: "approved"}}));
    const handleReject = () => dispatch(updateTestimonial({id: testimonialID, data: {status: "rejected"}}));
    const handleDelete = async () => {
        if (!window.confirm("Delete this testimonial? This cannot be undone.")) return;
        await dispatch(deleteTestimonial(testimonialID));
        navigate("/testimonials");
    };

    const t = testimonial || {};

    return (
        <Layout>
            {testimonialLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {testimonialError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{testimonialError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Testimonial</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button startIcon={<CheckCircleIcon/>} variant="outlined" color="success" size="small" onClick={handleApprove} disabled={t.status === "approved"}>Approve</Button>
                            <Button startIcon={<BlockIcon/>} variant="outlined" color="warning" size="small" onClick={handleReject} disabled={t.status === "rejected"}>Reject</Button>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Testimonial Details</Typography>
                                <InfoRow label="Customer" value={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar src={t.avatar} sx={{width: 24, height: 24}}/>
                                        <Typography variant="body2">{t.name}</Typography>
                                    </Stack>
                                }/>
                                <InfoRow label="Location" value={t.location}/>
                                <InfoRow label="Product" value={t.product}/>
                                <InfoRow label="Rating" value={<span style={{fontFamily: "monospace", letterSpacing: 1}}>{renderStars(t.rating)} ({t.rating}/5)</span>}/>
                                <InfoRow label="Date" value={t.created_at ? moment(t.created_at).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Title</Typography>
                                <Typography variant="body2" sx={{mt: 0.5, mb: 2, fontWeight: 500}}>{t.title || "—"}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Content</Typography>
                                <Typography variant="body2" sx={{mt: 0.5, whiteSpace: "pre-wrap", lineHeight: 1.8}}>{t.content || "—"}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                <Stack spacing={1}>
                                    <Chip label={t.status || "—"} size="small" color={statusColor(t.status)}/>
                                    {t.is_verified && <Chip label="Verified Purchase" size="small" color="info" variant="outlined"/>}
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default TestimonialDetailPage;
