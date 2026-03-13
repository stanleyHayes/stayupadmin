import React from "react";
import {
    Box, Button, Chip, Container, Divider, Grid, LinearProgress,
    Paper, Stack, Typography, Alert, AlertTitle
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {deleteCoupon, selectCoupons} from "../../redux/features/coupons/coupons-slice";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => {
    if (s === "ACTIVE") return "success";
    if (s === "UPCOMING") return "info";
    if (s === "EXPIRED") return "default";
    return "default";
};

const CouponDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {couponID} = useParams();
    const {coupons, couponLoading, couponError} = useSelector(selectCoupons);
    const coupon = coupons?.find(c => (c._id || c.id || c.code) === couponID) || null;

    const handleDelete = async () => {
        if (!window.confirm(`Delete coupon "${coupon?.code}"? This cannot be undone.`)) return;
        await dispatch(deleteCoupon(couponID));
        navigate("/coupons");
    };

    const c = coupon || {};

    return (
        <Layout>
            {couponLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {couponError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{couponError}</AlertTitle></Alert>}
                {!coupon && !couponLoading && (
                    <Alert severity="warning" sx={{mb: 2}}><AlertTitle>Coupon not found</AlertTitle></Alert>
                )}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Coupon Details</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/coupons/${couponID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete} disabled={!coupon}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid item size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                <LocalOfferIcon sx={{fontSize: 56, color: "secondary.main", mb: 1}}/>
                                <Typography variant="h5" sx={{fontFamily: "monospace", mb: 0.5}}>{c.code || "—"}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>{c.description}</Typography>
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    {c.status && <Chip label={c.status} size="small" color={statusColor(c.status)}/>}
                                    {c.discount_type && <Chip label={c.discount_type} size="small" variant="outlined"/>}
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Coupon Details</Typography>
                                <InfoRow label="Code" value={c.code}/>
                                <InfoRow label="Discount type" value={c.discount_type}/>
                                <InfoRow label="Amount" value={c.coupon_amount != null ? String(c.coupon_amount) : null}/>
                                <InfoRow label="Free shipping" value={c.allow_free_shipping ? "Yes" : "No"}/>
                                <InfoRow label="Individual use" value={c.is_individual_use ? "Yes" : "No"}/>
                                <InfoRow label="Exclude sale items" value={c.exclude_sale_items ? "Yes" : "No"}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Limits</Typography>
                                <InfoRow label="Min spend" value={c.minimum_spend ? `${c.minimum_spend.amount} ${c.minimum_spend.currency}` : null}/>
                                <InfoRow label="Max spend" value={c.maximum_spend ? `${c.maximum_spend.amount} ${c.maximum_spend.currency}` : null}/>
                                <InfoRow label="Usage limit" value={c.usage_limit_per_coupon != null ? String(c.usage_limit_per_coupon) : null}/>
                                <InfoRow label="Usage per person" value={c.usage_per_person != null ? String(c.usage_per_person) : null}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Validity</Typography>
                                <InfoRow label="Start date" value={c.start_date ? moment(c.start_date).format("ll") : null}/>
                                <InfoRow label="Expiry date" value={c.expiry_date ? moment(c.expiry_date).format("ll") : null}/>
                                <InfoRow label="Created by" value={c.created_by ? `${c.created_by.first_name} ${c.created_by.last_name}` : null}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default CouponDetailPage;
