// src/pages/attributes/CouponsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Grid,
    Tooltip,
    Chip,
    Snackbar,
    IconButton
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { motion } from "framer-motion";
import { Close, VisibilityOutlined, EditOutlined, DeleteForeverOutlined, LocalOfferOutlined, CheckCircleOutlined, TimerOffOutlined, TrendingUpOutlined, ContentCopy, Share } from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../../components/shared/empty.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";

// Redux slice exports (expected)
import {
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    selectCoupons
} from "../../redux/features/coupons/coupons-slice";

// Dialog components (must exist at these paths)
import CreateCouponDialog from "../../components/dialogs/create-coupon-dialog.jsx";
import UpdateCouponDialog from "../../components/dialogs/update-coupon-dialog.jsx";
import ViewCouponDialog from "../../components/dialogs/view-coupon-detail-dialog.jsx";
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

const CouponsPage = () => {
    const dispatch = useDispatch();
    const { coupons = [], couponLoading = false, couponError = null } = useSelector(selectCoupons);

    // UI state
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Dialog state
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
    };

    const handleShare = (coupon) => {
        const text = `Use coupon code: ${coupon.code}${coupon.description ? ` - ${coupon.description}` : ""}${coupon.amount ? ` (${coupon.discount_type === "percent" ? `${coupon.amount}% off` : `GH₵${coupon.amount} off`})` : ""}`;
        if (navigator.share) {
            navigator.share({title: `Coupon: ${coupon.code}`, text});
        } else {
            navigator.clipboard.writeText(text);
            setCopied(true);
        }
    };

    // Fetch attributes on mount
    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    // Filtered list (client-side)
    const filteredCoupons = useMemo(() => {
        if (!Array.isArray(coupons)) return [];
        const q = (query || "").trim().toLowerCase();

        return coupons.filter(c => {
            // status filter (supports DELETED via is_deleted)
            if (status !== "all") {
                if (status === "DELETED" && !c.is_deleted) return false;
                if (status !== "DELETED" && status !== (c.status || "ACTIVE")) {
                    // fallback: allow show active if not deleted
                    if (!(status === "ACTIVE" && !c.is_deleted)) return false;
                }
            }
            // date filter (use created_at or date_expires)
            const dateToCheck = c.created_at || c.date_expires || null;
            if (dateToCheck) {
                const d = moment(dateToCheck);
                if (startDate && d.isBefore(moment(startDate).startOf("day"))) return false;
                if (endDate && d.isAfter(moment(endDate).endOf("day"))) return false;
            }
            // query search across code, description, emails
            if (!q) return true;
            const haystack = [
                c.code,
                c.description,
                (c.email_restrictions || []).join(" "),
                (c.amount != null ? String(c.amount) : "")
            ].join(" ").toLowerCase();
            return haystack.includes(q);
        });
    }, [coupons, query, status, startDate, endDate]);

    // Dialog handlers
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const handleOpenView = (coupon) => {
        setSelectedCoupon(coupon);
        setOpenView(true);
    };
    const handleCloseView = () => {
        setSelectedCoupon(null);
        setOpenView(false);
    };

    const handleOpenEdit = (coupon) => {
        setSelectedCoupon(coupon);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setSelectedCoupon(null);
        setOpenEdit(false);
    };

    // CRUD operations (dispatch thunks)
    const handleCreate = (payload) => {
        dispatch(createCoupon(payload));
        setOpenCreate(false);
    };

    const handleUpdate = ({ id, data }) => {
        dispatch(updateCoupon({ id, data }));
        setOpenEdit(false);
        setSelectedCoupon(null);
    };

    const handleDelete = (coupon) => {
        if (!window.confirm(`Delete coupon "${coupon.code}"?`)) return;
        dispatch(deleteCoupon(coupon._id ?? coupon.id ?? coupon.code));
    };

    const renderEmails = (arr) => {
        if (!arr || arr.length === 0) return <Typography variant="body2" color="text.secondary">—</Typography>;
        return arr.map((e, i) => <Chip key={i} size="small" label={e} sx={{ mr: 0.5, mb: 0.5 }} />);
    };

    if (couponLoading && coupons.length === 0) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={8}/></Box></Layout>;

    return (
        <Layout>
            {couponLoading && <LinearProgress variant="query" color="secondary" />}
            <Box sx={{ pt: 4, pb: 6 }}>
                {couponError && (
                    <Alert severity="error" sx={{mb: 2}}>
                        <AlertTitle>{couponError}</AlertTitle>
                    </Alert>
                )}

                <Container>
                    <PageHeader
                        title="Coupons"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search coupons..."
                        action={
                            <Link to="/coupon/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Coupon</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Coupons" value={coupons?.length || 0} icon={<LocalOfferOutlined/>} iconColor="secondary" iconBg="secondary" trend={10}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Active" value={coupons?.filter(c => !c.is_deleted && (c.status || "ACTIVE") === "ACTIVE").length || 0} icon={<CheckCircleOutlined/>} iconColor="text.green" iconBg="light.green" trend={8}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Expired" value={coupons?.filter(c => c.date_expires && new Date(c.date_expires) < new Date()).length || 0} icon={<TimerOffOutlined/>} iconColor="text.red" iconBg="light.red"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Usage" value={coupons ? coupons.reduce((sum, c) => sum + Number(c.usage_count || 0), 0) : 0} icon={<TrendingUpOutlined/>} iconColor="text.blue" iconBg="light.blue" trend={22}/>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{xs: 12, md: 3}}>
                            <DatePicker
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                value={startDate}
                                onChange={date => setStartDate(moment(date))}
                                label="Start Date"
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 3}}>
                            <DatePicker
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                value={endDate}
                                onChange={date => setEndDate(moment(date))}
                                label="End Date"
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 3}}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Status</InputLabel>
                                <Select onChange={e => setStatus(e.target.value)} value={status} fullWidth size="small" label="Status" variant="outlined">
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="DELETED">Deleted</MenuItem>
                                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                    <MenuItem value="ACTIVE">Active</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{xs: 12, md: 3}}>
                            <Button
                                size="small"
                                color="secondary"
                                variant="outlined"
                                fullWidth
                                onClick={() => { setQuery(""); setStatus("all"); setStartDate(moment().startOf("day")); setEndDate(moment().endOf("day")); }}
                            >
                                Reset Filters
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{ my: 4 }} />

                    {Array.isArray(coupons) && coupons.length === 0 ? (
                        <Box>
                            <Empty
                                icon={
                                    <Box component={motion.div} exit={{}}>
                                        <Close
                                            sx={{
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: 1,
                                                borderColor: "light.secondary",
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                                cursor: "pointer"
                                            }}
                                        />
                                    </Box>
                                }
                                title="Coupons"
                                message="No attributes available"
                                button={
                                    <Button size="small" color="secondary" variant="outlined" onClick={handleOpenCreate}>
                                        Create Coupon
                                    </Button>
                                }
                            />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Expires</TableCell>
                                        <TableCell>Usage Count</TableCell>
                                        <TableCell>Emails</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filteredCoupons.map((c, idx) => (
                                        <TableRow hover key={c._id ?? c.id ?? idx}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{fontFamily: "monospace"}}>{c.code}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{c.description}</Typography>
                                                    </Box>
                                                    <Tooltip title="Copy code">
                                                        <IconButton size="small" onClick={() => handleCopyCode(c.code)} sx={{opacity: 0.5, "&:hover": {opacity: 1}}}>
                                                            <ContentCopy sx={{fontSize: 14}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{c.amount != null ? c.amount : "—"}</TableCell>
                                            <TableCell>{c.discount_type ?? "fixed_cart"}</TableCell>
                                            <TableCell>{c.date_expires ? moment(c.date_expires).format("YYYY-MM-DD") : "—"}</TableCell>
                                            <TableCell>{c.usage_count ?? 0}</TableCell>
                                            <TableCell>{renderEmails(c.email_restrictions)}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Coupon">
                                                        <VisibilityOutlined
                                                            onClick={() => handleOpenView(c)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Edit Coupon">
                                                        <EditOutlined
                                                            onClick={() => handleOpenEdit(c)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Share Coupon">
                                                        <Share
                                                            onClick={() => handleShare(c)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.blue", color: "icon.blue", backgroundColor: "light.blue", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Delete Coupon">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(c)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>

                {/* Dialogs */}
                <CreateCouponDialog open={openCreate} onClose={handleCloseCreate} onCreate={handleCreate} />
                <UpdateCouponDialog open={openEdit} coupon={selectedCoupon} onClose={handleCloseEdit} onUpdate={handleUpdate} />
                <ViewCouponDialog open={openView} coupon={selectedCoupon} onClose={handleCloseView} />
                <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} anchorOrigin={{vertical: "bottom", horizontal: "center"}} message="Copied to clipboard"/>
            </Box>
        </Layout>
    );
};

export default CouponsPage;
